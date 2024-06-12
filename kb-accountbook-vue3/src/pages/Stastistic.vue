<template>
  <div>
    <h1>Statistics</h1>
    <div>
      <button @click="toggleView('income')">Show Income</button>
      <button @click="toggleView('expense')">Show Expense</button>
    </div>
    <div v-if="showIncome">
      <h2 class="details-container">Income</h2>
      <PieChart v-if="incomeChartData" :chartData="incomeChartData" />
      <div class="details-container">
        <h3>Income Details</h3>
        <div class="details-table">
          <div
            class="table-row"
            v-for="(value, key, index) in sortedIncomeDetails"
            :key="key"
          >
            <div
              class="table-cell percentage"
              :style="{ backgroundColor: sortedIncomeColors[index] }"
            >
              {{ value.percentage }}%
            </div>
            <div class="table-cell category">{{ key }}</div>
            <div class="table-cell amount income">
              {{ formatAmount(value.amount) }}원
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showExpense">
      <h2 class="details-container">Expenses</h2>
      <div class="chart-and-target">
        <PieChart v-if="expenseChartData" :chartData="expenseChartData" />
        <div
          v-for="saving in savings"
          :key="saving.id"
          class="target-achievement"
        >
          <CircularProgressBar
            :percentage="
              parseFloat(calculateAchievement(saving.goal, totalExpense))
            "
            :details="`목표: ${formatAmount(saving.goal)}`"
            :risk="calculateRisk(saving.goal, totalExpense)"
          />
        </div>
      </div>
      <div class="details-container">
        <h3>Expense Details</h3>
        <div class="details-table">
          <div
            class="table-row"
            v-for="(value, key, index) in sortedExpenseDetails"
            :key="key"
          >
            <div
              class="table-cell percentage"
              :style="{ backgroundColor: sortedExpenseColors[index] }"
            >
              {{ value.percentage }}%
            </div>
            <div class="table-cell category">{{ key }}</div>
            <div class="table-cell amount expense">
              {{ formatAmount(value.amount) }}원
            </div>
          </div>
        </div>
      </div>
    </div>
    <p v-if="!incomeChartData && !expenseChartData">Loading...</p>
    <div class="footer">
      <p>© 2024 My Financial Dashboard</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import PieChart from '../components/PieChart.vue';
import CircularProgressBar from '../components/CircularProgressBar.vue';

export default {
  name: 'Statistic',
  components: {
    PieChart,
    CircularProgressBar,
  },
  setup() {
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
          '#4caf50', // 진한 녹색
          '#8bc34a', // 라임색
          '#cddc39', // 라임 라이트
          '#ffeb3b', // 밝은 노란색
          '#ffc107', // 호박색
          '#ff9800', // 주황색
          '#ff5722', // 진한 주황색
          '#f44336', // 빨간색
          '#e91e63', // 핫핑크
          '#9c27b0', // 보라색
          '#673ab7', // 인디고
          '#3f51b5', // 인디고 라이트
          '#2196f3', // 파란색
          '#03a9f4', // 밝은 파란색
          '#00bcd4', // 청록색
          '#009688', // 에메랄드 그린
          '#795548', // 브라운
          '#607d8b', // 블루 그레이
        ];

        const expenseColorsArray = [
          '#FFB3BA', // 밝은 파스텔 붉은색
          '#FFDFBA', // 밝은 파스텔 주황색
          '#FFB347', // 파스텔 오렌지색
          '#FFD1DC', // 밝은 파스텔 핑크색
          '#FF9AA2', // 중간 밝기 파스텔 붉은색
          '#FFB7B2', // 파스텔 붉은색
          '#FFDAC1', // 파스텔 오렌지색
          '#FFC3A0', // 파스텔 살구색
          '#FFB6C1', // 파스텔 연분홍색
          '#FFC0CB', // 파스텔 핑크색
          '#FFDAB9', // 파스텔 복숭아색
          '#FFE4E1', // 파스텔 장미색
          '#FFE4B5', // 파스텔 밀감색
          '#FFA07A', // 파스텔 라이트 살몬색
          '#FF7F50', // 파스텔 코랄색
          '#FF6F61', // 파스텔 로즈색
          '#FF4500', // 파스텔 오렌지레드색
          '#FF6347', // 파스텔 토마토색
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

        incomeCategoriesCount.value = Object.keys(sortedIncome).length;
        expenseCategoriesCount.value = Object.keys(sortedExpense).length;

        savings.value = data.value.saving.map((item) => ({
          id: item.id,
          goal: parseInt(
            item.categoryAllowance.replace(/,/g, '').replace('원', '')
          ),
        }));
      } catch (error) {
        console.error('Error fetching data:', error.message);
        console.error(
          error.response ? error.response.data : 'No response from server'
        );
      }
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
      if (achievement >= 75) {
        return 'High';
      } else if (achievement >= 50) {
        return 'Medium';
      } else {
        return 'Low';
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
    };
  },
};
</script>

<style scoped>
canvas {
  width: 100%;
  height: 400px;
}

.details-container {
  margin-top: 40px; /* 간격 조정 */
  text-align: center; /* 중앙 정렬 */
}

.details-table {
  margin: 0 auto;
  width: 80%;
  max-width: 600px;
  border-collapse: collapse;
}

.table-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
}

.table-cell {
  flex: 1;
  text-align: center;
}

.percentage {
  font-weight: bold;
  color: #fff;
  padding: 5px;
  border-radius: 8px;
}

.amount.income {
  color: #4caf50; /* 초록색 */
}

.amount.expense {
  color: #ff5722; /* 빨간색 */
}

.footer {
  margin-top: 40px;
  text-align: center;
}

.footer p {
  margin: 0;
  padding: 10px;
  background-color: #35495e;
  color: white;
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
}

button {
  margin: 10px;
  padding: 10px 20px;
  border: none;
  background-color: #35495e;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #2c3e50;
}

.chart-and-target {
  display: flex;
  align-items: center;
  justify-content: center;
}

.target-achievement {
  margin-left: 20px;
}
</style>
