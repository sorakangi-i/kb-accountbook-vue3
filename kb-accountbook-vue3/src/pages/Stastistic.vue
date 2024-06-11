<template>
  <div>
    <h1>Statistics</h1>
    <div>
      <button @click="toggleView('income')">Show Income</button>
      <button @click="toggleView('expense')">Show Expense</button>
    </div>
    <div v-if="showIncome">
      <h2 class="details-container">Income</h2>
      <PieChart :chartData="incomeChartData" />
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
              :style="{ backgroundColor: incomeColors[index] }"
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
      <PieChart :chartData="expenseChartData" />
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
              :style="{ backgroundColor: expenseColors[index] }"
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

export default {
  name: 'Statistic',
  components: {
    PieChart,
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

    const fetchData = async () => {
      try {
        const response = await axios.get('/db.json'); // 경로가 정확한지 확인
        data.value = response.data;

        const income = data.value.budget
          .filter((item) => item.type === 'income')
          .reduce((acc, curr) => {
            const category = curr.category;
            const amount = parseInt(curr.amount); // amount가 숫자형으로 가정
            if (!acc[category]) {
              acc[category] = 0;
            }
            acc[category] += amount;
            return acc;
          }, {});

        const expense = data.value.budget
          .filter((item) => item.type === '지출')
          .reduce((acc, curr) => {
            const category = curr.category;
            const amount = parseInt(
              curr.amount.replace(/,/g, '').replace('원', '')
            );
            if (!acc[category]) {
              acc[category] = 0;
            }
            acc[category] += amount;
            return acc;
          }, {});

        const totalIncome = Object.values(income).reduce((a, b) => a + b, 0);
        const totalExpense = Object.values(expense).reduce((a, b) => a + b, 0);

        incomeData.value = income;
        expenseData.value = expense;

        incomeChartData.value = {
          labels: Object.keys(income),
          datasets: [
            {
              label: 'Income by Category',
              backgroundColor: [
                '#f87979',
                '#a8d8ea',
                '#ffe6eb',
                '#d4a5a5',
                '#a0c1b8',
                '#d9bf77',
                '#f7c5cc',
                '#e1d89f',
              ],
              data: Object.values(income),
            },
          ],
        };

        expenseChartData.value = {
          labels: Object.keys(expense),
          datasets: [
            {
              label: 'Expenses by Category',
              backgroundColor: [
                '#f87979',
                '#a8d8ea',
                '#ffe6eb',
                '#d4a5a5',
                '#a0c1b8',
                '#d9bf77',
                '#f7c5cc',
                '#e1d89f',
              ],
              data: Object.values(expense),
            },
          ],
        };

        incomeDetails.value = Object.entries(income).reduce(
          (acc, [key, value]) => {
            acc[key] = {
              percentage: ((value / totalIncome) * 100).toFixed(2),
              amount: value,
            };
            return acc;
          },
          {}
        );

        expenseDetails.value = Object.entries(expense).reduce(
          (acc, [key, value]) => {
            acc[key] = {
              percentage: ((value / totalExpense) * 100).toFixed(2),
              amount: value,
            };
            return acc;
          },
          {}
        );

        incomeColors.value = incomeChartData.value.datasets[0].backgroundColor;
        expenseColors.value =
          expenseChartData.value.datasets[0].backgroundColor;

        incomeCategoriesCount.value = Object.keys(income).length;
        expenseCategoriesCount.value = Object.keys(expense).length;
      } catch (error) {
        console.error('Error fetching data:', error.message); // 오류 메시지 출력
        console.error(
          error.response ? error.response.data : 'No response from server'
        ); // 서버 응답 출력
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
      return amount.toLocaleString();
    };

    const sortedIncomeDetails = computed(() => {
      return Object.fromEntries(
        Object.entries(incomeDetails.value).sort(
          ([, a], [, b]) => b.percentage - a.percentage
        )
      );
    });

    const sortedExpenseDetails = computed(() => {
      return Object.fromEntries(
        Object.entries(expenseDetails.value).sort(
          ([, a], [, b]) => b.percentage - a.percentage
        )
      );
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
      incomeColors,
      expenseColors,
      formatAmount,
      showIncome,
      showExpense,
      toggleView,
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
</style>
