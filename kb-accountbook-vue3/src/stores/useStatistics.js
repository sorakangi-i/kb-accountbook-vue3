import axios from 'axios';
import { ref, onMounted, computed, watch } from 'vue';

export function useStatistics() {
  const data = ref(null);
  const incomeChartData = ref(null);
  const expenseChartData = ref(null);
  const incomeDetails = ref({});
  const expenseDetails = ref({});
  const incomeCategoriesCount = ref(0);
  const expenseCategoriesCount = ref(0);
  const incomeData = ref({});
  const expenseData = ref({});
  const incomeColors = ref([]);
  const expenseColors = ref([]);
  const showIncome = ref(false);
  const showExpense = ref(true);
  const savings = ref([]);
  const totalExpense = ref(0);
  const totalGoalAmount = ref(0);
  const totalActualExpense = ref(0);
  const selectedCategory = ref(null);
  const selectedCategoryData = ref(null);
  const selectedCategoryRisk = ref(null);
  const showCategoryDetail = ref(false); // 카테고리 상세보기 상태 추가

  const fetchData = async () => {
    try {
      const response = await axios.get('/db.json');
      data.value = response.data;

      const incomeCategoryMap = Object.fromEntries(
        data.value.incomeCategories.map((cat) => [cat.id, cat.name])
      );
      const expenseCategoryMap = Object.fromEntries(
        data.value.expenseCategories.map((cat) => [cat.id, cat.name])
      );

      const income = data.value.budget
        .filter((item) => item.type === '수입')
        .reduce((acc, curr) => {
          const category = incomeCategoryMap[curr.category] || curr.category;
          const amount = parseInt(curr.amount);
          if (!acc[category]) {
            acc[category] = 0;
          }
          acc[category] += amount;
          return acc;
        }, {});

      const expense = data.value.budget
        .filter((item) => item.type === '지출')
        .reduce((acc, curr) => {
          const category = expenseCategoryMap[curr.category] || curr.category;
          const amount = parseInt(curr.amount);
          if (!acc[category]) {
            acc[category] = 0;
          }
          acc[category] += amount;
          return acc;
        }, {});

      totalExpense.value = Object.values(expense).reduce((a, b) => a + b, 0);
      const totalIncome = Object.values(income).reduce((a, b) => a + b, 0);

      incomeData.value = income;
      expenseData.value = expense;

      const incomeColorsArray = [
        '#4caf50',
        '#8bc34a',
        '#cddc39',
        '#ffeb3b',
        '#ffc107',
        '#ff9800',
        '#ff5722',
        '#f44336',
        '#e91e63',
        '#9c27b0',
        '#673ab7',
        '#3f51b5',
        '#2196f3',
        '#03a9f4',
        '#00bcd4',
        '#009688',
        '#795548',
        '#607d8b',
      ];

      const expenseColorsArray = [
        '#FFB3BA',
        '#FFDFBA',
        '#FFB347',
        '#FFD1DC',
        '#FF9AA2',
        '#FFB7B2',
        '#FFDAC1',
        '#FFC3A0',
        '#FFB6C1',
        '#FFC0CB',
        '#FFDAB9',
        '#FFE4E1',
        '#FFE4B5',
        '#FFA07A',
        '#FF7F50',
        '#FF6F61',
        '#FF4500',
        '#FF6347',
      ];

      const sortedIncomeEntries = Object.entries(income).sort(
        ([, a], [, b]) => b - a
      );
      const sortedExpenseEntries = Object.entries(expense).sort(
        ([, a], [, b]) => b - a
      );
      const sortedIncome = Object.fromEntries(sortedIncomeEntries);
      const sortedExpense = Object.fromEntries(sortedExpenseEntries);

      incomeDetails.value = Object.entries(sortedIncome).reduce(
        (acc, [key, value]) => {
          acc[key] = {
            percentage: ((value / totalIncome) * 100).toFixed(2),
            amount: value,
          };
          return acc;
        },
        {}
      );
      expenseDetails.value = Object.entries(sortedExpense).reduce(
        (acc, [key, value]) => {
          acc[key] = {
            percentage: ((value / totalExpense.value) * 100).toFixed(2),
            amount: value,
          };
          return acc;
        },
        {}
      );
      incomeColors.value = sortedIncomeEntries.map(
        ([,], index) => incomeColorsArray[index % incomeColorsArray.length]
      );
      expenseColors.value = sortedExpenseEntries.map(
        ([,], index) => expenseColorsArray[index % expenseColorsArray.length]
      );

      incomeChartData.value = {
        labels: Object.keys(sortedIncome),
        datasets: [
          {
            label: 'Income by Category',
            backgroundColor: incomeColors.value,
            data: Object.values(sortedIncome),
          },
        ],
      };
      expenseChartData.value = {
        labels: Object.keys(sortedExpense),
        datasets: [
          {
            label: 'Expenses by Category',
            backgroundColor: expenseColors.value,
            data: Object.values(sortedExpense),
          },
        ],
      };

      calculateSavings();
    } catch (error) {
      console.error('Error fetching data:', error.message);
      console.error(
        error.response ? error.response.data : 'No response from server'
      );
    }
  };

  const calculateSavings = () => {
    totalGoalAmount.value = data.value.saving.reduce((acc, item) => {
      const goal = parseInt(
        item.categoryAllowance.replace(/,/g, '').replace('원', '')
      );
      return acc + goal;
    }, 0);

    totalActualExpense.value = Object.values(expenseData.value).reduce(
      (acc, curr) => acc + curr,
      0
    );

    savings.value = data.value.saving.map((item) => ({
      id: item.id,
      goal: parseInt(
        item.categoryAllowance.replace(/,/g, '').replace('원', '')
      ),
      category: item.category,
    }));
  };

  const toggleView = (type) => {
    if (type === 'income') {
      showIncome.value = true;
      showExpense.value = false;
    } else if (type === 'expense') {
      showIncome.value = false;
      showExpense.value = true;
    }
  };

  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) return '0';
    return amount.toLocaleString();
  };

  const calculateAchievement = (goal, totalExpense) => {
    if (goal === 0) return 0;
    return Math.min((totalExpense / goal) * 100, 100).toFixed(2);
  };

  const calculateRisk = (goal, totalExpense) => {
    const achievement = calculateAchievement(goal, totalExpense);
    if (achievement >= 80) {
      return '비만';
    } else if (achievement >= 50) {
      return '평범';
    } else {
      return '건강';
    }
  };

  const sortedIncomeDetails = computed(() => {
    return incomeDetails.value;
  });

  const sortedExpenseDetails = computed(() => {
    return expenseDetails.value;
  });

  const sortedIncomeColors = computed(() => {
    return incomeColors.value;
  });

  const sortedExpenseColors = computed(() => {
    return expenseColors.value;
  });

  const selectCategory = (category) => {
    if (selectedCategory.value === category) {
      // 이미 선택된 카테고리를 다시 클릭하면 상세보기 상태를 토글
      showCategoryDetail.value = !showCategoryDetail.value;
    } else {
      selectedCategory.value = category;
      const saving = savings.value.find((item) => item.category === category);
      const actual = expenseData.value[category] || 0;
      selectedCategoryData.value = {
        goal: saving ? saving.goal : 0,
        actual,
      };
      selectedCategoryRisk.value = calculateRisk(
        saving ? saving.goal : 0,
        actual
      );
      showCategoryDetail.value = true; // 새로운 카테고리를 선택하면 상세보기 표시
    }
  };

  watch(data, calculateSavings, { deep: true });

  onMounted(fetchData);

  return {
    data,
    incomeChartData,
    expenseChartData,
    sortedIncomeDetails,
    sortedExpenseDetails,
    incomeCategoriesCount,
    expenseCategoriesCount,
    incomeData,
    expenseData,
    sortedIncomeColors,
    sortedExpenseColors,
    formatAmount,
    calculateAchievement,
    calculateRisk,
    showIncome,
    showExpense,
    toggleView,
    savings,
    totalExpense,
    totalGoalAmount,
    totalActualExpense,
    selectedCategory,
    selectedCategoryData,
    selectCategory,
    selectedCategoryRisk,
    showCategoryDetail, // 상세보기 상태 반환
  };
}
