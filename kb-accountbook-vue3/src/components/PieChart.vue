<template>
  <!-- 파이 차트 컴포넌트 템플릿 -->
  <div>
    <!-- 캔버스 요소 -->
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { usePieChart } from '../stores/usePieChart'; // PieChart 커스텀 훅 가져오기

export default {
  name: 'PieChart', // 컴포넌트 이름
  props: {
    chartData: {
      // 차트 데이터 프로퍼티
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { canvas } = usePieChart(props); // PieChart 훅 사용하여 캔버스 요소 가져오기
    return { canvas }; // 캔버스 요소 반환
  },
};
</script>

<style scoped>
/* 컴포넌트 내부 스타일 */

/* 캔버스 요소 스타일 */
canvas {
  width: 100%; /* 너비 100% 설정 */
  height: 400px; /* 높이 400px 설정 */
}
</style>
