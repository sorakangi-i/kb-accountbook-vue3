<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables, ChartDataLabels);

export default {
  name: 'PieChart',
  props: {
    chartData: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const canvas = ref(null);
    let chartInstance = null;

    const renderChart = () => {
      if (chartInstance) {
        chartInstance.destroy();
      }

      if (canvas.value) {
        // 정렬된 데이터 생성
        const sortedData = props.chartData.labels
          .map((label, index) => ({
            label,
            value: props.chartData.datasets[0].data[index],
            backgroundColor: props.chartData.datasets[0].backgroundColor[index],
          }))
          .sort((a, b) => b.value - a.value);

        const sortedLabels = sortedData.map((item) => item.label);
        const sortedValues = sortedData.map((item) => item.value);
        const sortedColors = sortedData.map((item) => item.backgroundColor);

        chartInstance = new Chart(canvas.value.getContext('2d'), {
          type: 'pie',
          data: {
            labels: sortedLabels,
            datasets: [
              {
                label: 'Category',
                backgroundColor: sortedColors,
                data: sortedValues,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const label = context.label || '';
                    const value = context.raw;
                    const total = context.chart._metasets[0].total;
                    const percentage = ((value / total) * 100).toFixed(2) + '%';
                    return `${label}: ${percentage}`;
                  },
                },
              },
              datalabels: {
                display: false, // 라벨 비활성화
              },
            },
          },
        });
      }
    };

    onMounted(() => {
      if (props.chartData) {
        renderChart();
      }
    });

    watch(
      () => props.chartData,
      (newVal) => {
        if (newVal) {
          renderChart();
        }
      },
      { deep: true }
    );

    return { canvas };
  },
};
</script>

<style scoped>
canvas {
  width: 100%;
  height: 400px;
}
</style>
