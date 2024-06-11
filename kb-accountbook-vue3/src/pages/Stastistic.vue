<template>
  <div>
    <h1>Statistics</h1>
    <PieChart v-if="chartData" :chartData="chartData" />
    <p v-else>Loading...</p>
    <div v-if="data">
      <h2>Member</h2>
      <pre>{{ data.member }}</pre>
      <h2>Saving</h2>
      <pre>{{ data.saving }}</pre>
      <h2>Categories</h2>
      <pre>{{ data.categories }}</pre>
      <h2>Budget</h2>
      <pre>{{ data.budget }}</pre>
      <h2>Periodic</h2>
      <pre>{{ data.periodic }}</pre>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import PieChart from '../components/PieChart.vue';

export default {
  name: 'Statistic',
  components: {
    PieChart,
  },
  setup() {
    const data = ref(null);
    const chartData = ref(null);

    const fetchData = async () => {
      try {
        const response = await axios.get('/db.json'); // 경로가 정확한지 확인
        data.value = response.data;

        const expenseData = data.value.budget
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

        chartData.value = {
          labels: Object.keys(expenseData),
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
              data: Object.values(expenseData),
            },
          ],
        };
      } catch (error) {
        console.error('Error fetching data:', error.message); // 오류 메시지 출력
        console.error(error.response ? error.response.data : 'No response from server'); // 서버 응답 출력
      }
    };

    onMounted(fetchData);

    return { data, chartData };
  },
};
</script>

<style scoped>
/* 스타일 정의 */
</style>
