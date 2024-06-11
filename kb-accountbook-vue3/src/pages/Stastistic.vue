<template>
  <div class="statistics">
    <h1>통계</h1>
    <div>
      <button @click="toggleView('income')">Show Income</button>
      <button @click="toggleView('expense')">Show Expense</button>
    </div>
    <div v-if="incomeChartData && showIncome">
      <div class="chart-container">
        <h2>Income</h2>
        <PieChart :chartData="incomeChartData" />
        <div class="details-container">
          <h3>Income Details</h3>
          <table>
            <thead>
              <tr>
                <th>Percentage</th>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(value, key) in sortedIncomeDetails" :key="key">
                <td>{{ value }}%</td>
                <td>{{ key }}</td>
                <td>{{ incomeData[key] }}원</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-if="expenseChartData && showExpense">
      <div class="chart-container">
        <h2>Expenses</h2>
        <PieChart :chartData="expenseChartData" />
        <div class="details-container">
          <h3>Expense Details</h3>
          <table>
            <thead>
              <tr>
                <th>Percentage</th>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(value, key) in sortedExpenseDetails" :key="key">
                <td>{{ value }}%</td>
                <td>{{ key }}</td>
                <td>{{ expenseData[key] }}원</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <p v-if="!incomeChartData && !expenseChartData">Loading...</p>
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
    const showIncome = ref(false);
    const showExpense = ref(true); // 초기 상태를 true로 설정하여 Expenses를 디폴트로 표시

    const fetchData = async () => {
      try {
        const response = await axios.get('/db.json'); // 경로가 정확한지 확인
        data.value = response.data;

        incomeData.value = data.value.budget
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

        expenseData.value = data.value.budget
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

        const totalIncome = Object.values(incomeData.value).reduce(
          (a, b) => a + b,
          0
        );
        const totalExpense = Object.values(expenseData.value).reduce(
          (a, b) => a + b,
          0
        );

        incomeChartData.value = {
          labels: Object.keys(incomeData.value),
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
              data: Object.values(incomeData.value),
            },
          ],
        };

        expenseChartData.value = {
          labels: Object.keys(expenseData.value),
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
              data: Object.values(expenseData.value),
            },
          ],
        };

        incomeDetails.value = Object.entries(incomeData.value).reduce(
          (acc, [key, value]) => {
            acc[key] = ((value / totalIncome) * 100).toFixed(2);
            return acc;
          },
          {}
        );

        expenseDetails.value = Object.entries(expenseData.value).reduce(
          (acc, [key, value]) => {
            acc[key] = ((value / totalExpense) * 100).toFixed(2);
            return acc;
          },
          {}
        );

        incomeCategoriesCount.value = Object.keys(incomeData.value).length;
        expenseCategoriesCount.value = Object.keys(expenseData.value).length;
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

    const sortedIncomeDetails = computed(() => {
      return Object.fromEntries(
        Object.entries(incomeDetails.value).sort(([, a], [, b]) => b - a)
      );
    });

    const sortedExpenseDetails = computed(() => {
      return Object.fromEntries(
        Object.entries(expenseDetails.value).sort(([, a], [, b]) => b - a)
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
      showIncome,
      showExpense,
      toggleView,
    };
  },
};
</script>

<style scoped>
.statistics {
  padding: 20px;
}

.chart-container {
  margin-bottom: 40px;
}

.details-container {
  margin-top: 20px;
  text-align: center;
}

.details-container table {
  margin: 0 auto;
  border-collapse: collapse;
  width: 80%;
}

.details-container th,
.details-container td {
  border: 1px solid #ddd;
  padding: 8px;
}

.details-container th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.details-container td {
  text-align: center;
}

.details-container tr:nth-child(even) {
  background-color: #f9f9f9;
}

.details-container tr:hover {
  background-color: #ddd;
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
