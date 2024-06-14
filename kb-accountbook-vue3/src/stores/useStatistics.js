import axios from 'axios';
import { ref, onMounted, computed, watch } from 'vue';

export function useStatistics() {
  // 반응형 상태
  const data = ref({
    member: [],
    saving: [],
    incomeCategories: [],
    expenseCategories: [],
    paymentMethods: [],
    types: [],
    budget: [],
  });

  // 차트, 세부사항, 카운트, 색상, 토글을 위한 반응형 속성
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
  const showCategoryDetail = ref(false);

  // 서버에서 데이터 가져오기
  const fetchData = async () => {
    try {
      // 여러 엔드포인트에서 데이터 가져오기
      const [
        memberRes,
        savingRes,
        incomeCategoriesRes,
        expenseCategoriesRes,
        paymentMethodsRes,
        typesRes,
        budgetRes,
      ] = await Promise.all([
        axios.get('http://localhost:3000/member'),
        axios.get('http://localhost:3000/saving'),
        axios.get('http://localhost:3000/incomeCategories'),
        axios.get('http://localhost:3000/expenseCategories'),
        axios.get('http://localhost:3000/paymentMethods'),
        axios.get('http://localhost:3000/types'),
        axios.get('http://localhost:3000/budget'),
      ]);

      // 가져온 데이터를 반응형 상태에 설정
      data.value = {
        member: memberRes.data,
        saving: savingRes.data,
        incomeCategories: incomeCategoriesRes.data,
        expenseCategories: expenseCategoriesRes.data,
        paymentMethods: paymentMethodsRes.data,
        types: typesRes.data,
        budget: budgetRes.data,
      };

      // 카테고리 매핑
      const incomeCategoryMap = Object.fromEntries(
        data.value.incomeCategories.map((cat) => [cat.id, cat.name])
      );
      const expenseCategoryMap = Object.fromEntries(
        data.value.expenseCategories.map((cat) => [cat.id, cat.name])
      );

      // 수입 데이터 처리
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

      // 지출 데이터 처리
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

      // 총 지출 계산
      totalExpense.value = Object.values(expense).reduce((a, b) => a + b, 0);
      const totalIncome = Object.values(income).reduce((a, b) => a + b, 0);

      // 수입 및 지출 데이터를 반응형 상태에 설정
      incomeData.value = income;
      expenseData.value = expense;

      // 색상 배열
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

      // 정렬된 수입 및 지출 데이터
      const sortedIncomeEntries = Object.entries(income).sort(
        ([, a], [, b]) => b - a
      );
      const sortedExpenseEntries = Object.entries(expense).sort(
        ([, a], [, b]) => b - a
      );
      const sortedIncome = Object.fromEntries(sortedIncomeEntries);
      const sortedExpense = Object.fromEntries(sortedExpenseEntries);

      // 수입 및 지출 세부 사항 계산
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

      // 차트에 사용할 색상 설정
      incomeColors.value = sortedIncomeEntries.map(
        ([,], index) => incomeColorsArray[index % incomeColorsArray.length]
      );
      expenseColors.value = sortedExpenseEntries.map(
        ([,], index) => expenseColorsArray[index % expenseColorsArray.length]
      );

      // 차트 데이터 설정
      incomeChartData.value = {
        labels: Object.keys(sortedIncome),
        datasets: [
          {
            label: '수입 카테고리별',
            backgroundColor: incomeColors.value,
            data: Object.values(sortedIncome),
          },
        ],
      };
      expenseChartData.value = {
        labels: Object.keys(sortedExpense),
        datasets: [
          {
            label: '지출 카테고리별',
            backgroundColor: expenseColors.value,
            data: Object.values(sortedExpense),
          },
        ],
      };

      // 저축 계산
      calculateSavings();
    } catch (error) {
      console.error('데이터 가져오기 오류:', error.message);
      console.error(
        error.response ? error.response.data : '서버로부터 응답 없음'
      );
    }
  };

  // 저축 계산 함수
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

  // 보기 토글 함수
  const toggleView = (type) => {
    if (type === 'income') {
      showIncome.value = true;
      showExpense.value = false;
    } else if (type === 'expense') {
      showIncome.value = false;
      showExpense.value = true;
    }
  };

  // 금액 형식 함수
  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) return '0';
    return amount.toLocaleString();
  };

  // 달성률 계산 함수
  const calculateAchievement = (goal, totalExpense) => {
    if (goal === 0) return 0;
    return Math.min((totalExpense / goal) * 100, 100).toFixed(2);
  };

  // 위험도 계산 함수
  const calculateRisk = (goal, totalExpense) => {
    const achievement = calculateAchievement(goal, totalExpense);
    if (achievement >= 80) {
      return '높음';
    } else if (achievement >= 50) {
      return '중간';
    } else {
      return '낮음';
    }
  };

  // 정렬된 수입 세부 사항 계산
  const sortedIncomeDetails = computed(() => {
    return incomeDetails.value;
  });

  // 정렬된 지출 세부 사항 계산
  const sortedExpenseDetails = computed(() => {
    return expenseDetails.value;
  });

  // 정렬된 수입 색상 계산
  const sortedIncomeColors = computed(() => {
    return incomeColors.value;
  });

  // 정렬된 지출 색상 계산
  const sortedExpenseColors = computed(() => {
    return expenseColors.value;
  });

  // 카테고리 선택 함수
  const selectCategory = (category) => {
    if (selectedCategory.value === category) {
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
      showCategoryDetail.value = true;
    }
  };

  // 데이터 변경 시 저축 계산을 다시 수행
  watch(data, calculateSavings, { deep: true });

  // 컴포넌트가 마운트될 때 데이터 가져오기
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
    showCategoryDetail,
  };
}
