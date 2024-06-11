<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

// Chart.js의 모든 컴포넌트를 등록합니다.
Chart.register(...registerables)

export default {
  name: 'PieChart',
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const canvas = ref(null)
    let chartInstance = null

    const renderChart = () => {
      if (chartInstance) {
        chartInstance.destroy()
      }

      if (canvas.value) {
        chartInstance = new Chart(canvas.value.getContext('2d'), {
          type: 'pie',
          data: props.chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        })
      }
    }

    onMounted(() => {
      if (props.chartData) {
        renderChart()
      }
    })

    watch(() => props.chartData, (newVal) => {
      if (newVal) {
        renderChart()
      }
    }, { deep: true })

    return { canvas }
  }
}
</script>

<style scoped>
canvas {
  width: 100%;
  height: 400px;
}
</style>
