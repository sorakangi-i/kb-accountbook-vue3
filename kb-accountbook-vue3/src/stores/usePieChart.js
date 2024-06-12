import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Chart.js에서 사용할 수 있는 차트 유형을 등록합니다.
Chart.register(...registerables, ChartDataLabels);

// usePieChart 훅을 정의합니다.
export function usePieChart(props) {
  // 차트를 그릴 캔버스 요소에 대한 참조를 생성합니다.
  const canvas = ref(null);
  // 차트 인스턴스를 저장할 변수를 초기화합니다.
  let chartInstance = null;

  // 차트를 렌더링하는 함수를 정의합니다.
  const renderChart = () => {
    // 이전에 생성된 차트 인스턴스가 있으면 파기합니다.
    if (chartInstance) {
      chartInstance.destroy();
    }

    // 캔버스 요소가 존재하는 경우에만 차트를 렌더링합니다.
    if (canvas.value) {
      // 차트를 그리기 위한 데이터를 정렬합니다.
      const sortedData = props.chartData.labels
        .map((label, index) => ({
          label,
          value: props.chartData.datasets[0].data[index],
          backgroundColor: props.chartData.datasets[0].backgroundColor[index],
        }))
        .sort((a, b) => b.value - a.value);

      // 정렬된 데이터에서 레이블, 값, 색상을 추출합니다.
      const sortedLabels = sortedData.map((item) => item.label);
      const sortedValues = sortedData.map((item) => item.value);
      const sortedColors = sortedData.map((item) => item.backgroundColor);

      // Chart.js를 사용하여 캔버스에 원형 차트를 그립니다.
      chartInstance = new Chart(canvas.value.getContext('2d'), {
        type: 'pie', // 차트 유형: 원형
        data: {
          labels: sortedLabels, // 레이블
          datasets: [
            {
              label: 'Category', // 데이터셋 레이블
              backgroundColor: sortedColors, // 배경색
              data: sortedValues, // 값
            },
          ],
        },
        options: {
          responsive: true, // 반응형 활성화
          maintainAspectRatio: false, // 가로 세로 비율 유지 비활성화
          plugins: {
            // 툴팁 플러그인 옵션 설정
            tooltip: {
              callbacks: {
                // 툴팁 라벨 콜백 함수
                label: function (context) {
                  const label = context.label || ''; // 라벨
                  const value = context.raw; // 원본 데이터
                  const total = context.chart._metasets[0].total; // 전체 합
                  const percentage = ((value / total) * 100).toFixed(2) + '%'; // 백분율 계산
                  return `${label}: ${percentage}`; // 라벨: 백분율 형태로 반환
                },
              },
            },
            // 데이터 라벨 플러그인 옵션 설정
            datalabels: {
              display: false, // 데이터 라벨 표시 비활성화
            },
          },
        },
      });
    }
  };

  // 컴포넌트가 마운트된 후 실행될 로직을 정의합니다.
  onMounted(() => {
    // props.chartData가 정의되었을 때 차트를 렌더링합니다.
    if (props.chartData) {
      renderChart();
    }
  });

  // props.chartData가 변경될 때마다 호출되는 watcher를 정의합니다.
  watch(
    () => props.chartData,
    (newVal) => {
      // props.chartData가 새로운 값으로 설정되면 차트를 다시 렌더링합니다.
      if (newVal) {
        renderChart();
      }
    },
    { deep: true } // props.chartData의 속성까지 재귀적으로 감지하도록 설정합니다.
  );

  // 캔버스 요소에 대한 참조를 반환합니다.
  return { canvas };
}
