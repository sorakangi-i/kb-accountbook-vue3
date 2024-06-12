<template>
  <!-- 통계 페이지 템플릿 -->
  <div>
    <!-- 페이지 제목 -->
    <h1>Statistics</h1>
    <!-- 수입, 지출 토글 버튼 -->
    <div>
      <button @click="toggleView('income')">
        <i class="fa-solid fa-coins"></i> Show Income
      </button>
      <button @click="toggleView('expense')">
        <i class="fa-solid fa-wallet"></i> Show Expense
      </button>
    </div>
    <!-- 수입 섹션 -->
    <div v-if="showIncome">
      <h2 class="details-container">
        <i class="fa-solid fa-coins"></i> Income
      </h2>
      <!-- 수입 원형 차트 -->
      <PieChart v-if="incomeChartData" :chartData="incomeChartData" />
      <!-- 수입 세부 정보 -->
      <div class="details-container">
        <h3><i class="fa-solid fa-coins"></i> Income Details</h3>
        <!-- 수입 세부 정보 테이블 -->
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
    <!-- 지출 섹션 -->
    <div v-if="showExpense">
      <h2 class="details-container">
        <i class="fa-solid fa-wallet"></i> Expenses
      </h2>
      <!-- 지출 원형 차트와 목표 달성율 표시 -->
      <div class="chart-and-target">
        <PieChart v-if="expenseChartData" :chartData="expenseChartData" />
        <div
          v-for="saving in savings"
          :key="saving.id"
          class="target-achievement"
        >
          <!-- 원형 프로그레스 바 -->
          <CircularProgressBar
            :percentage="
              parseFloat(calculateAchievement(saving.goal, totalExpense))
            "
            :details="`목표: ${formatAmount(saving.goal)}`"
            :risk="calculateRisk(saving.goal, totalExpense)"
          />
        </div>
      </div>
      <!-- 지출 세부 정보 -->
      <div class="details-container">
        <h3><i class="fa-solid fa-wallet"></i> Expense Details</h3>
        <!-- 지출 세부 정보 테이블 -->
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
    <!-- 데이터 로딩 중일 때 표시되는 메시지 -->
    <p v-if="!incomeChartData && !expenseChartData">Loading...</p>
    <!-- 페이지 하단에 표시되는 footer -->
    <div class="footer">
      <p>© 2024 My Financial Dashboard</p>
    </div>
  </div>
</template>

<script>
import { useStatistics } from '../stores/useStatistics';
import PieChart from '../components/PieChart.vue';
import CircularProgressBar from '../components/CircularProgressBar.vue';

export default {
  name: 'Statistic',
  components: {
    PieChart,
    CircularProgressBar,
  },
  setup() {
    // 통계 데이터 및 관련 기능을 가져오는 커스텀 훅 사용
    const {
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
    } = useStatistics();
    // 카테고리와 아이콘 클래스를 매핑하는 객체
    // const categoryIconMap = {
    //   '월급': 'fa-solid fa-wallet',
    //   '용돈': 'fa-solid fa-hand-holding-usd',
    //   '환급': 'fa-solid fa-undo-alt',
    //   '기타': 'fa-solid fa-ellipsis-h',
    //   '온라인쇼핑': 'fa-solid fa-shopping-cart',
    //   '패션/쇼핑': 'fa-solid fa-tshirt',
    //   '식비': 'fa-solid fa-utensils',
    //   '카페/간식': 'fa-solid fa-coffee',
    //   '주거': 'fa-solid fa-home',
    //   '통신': 'fa-solid fa-phone',
    //   '교통/차량': 'fa-solid fa-car',
    //   '의료/건강': 'fa-solid fa-heartbeat',
    //   '보험': 'fa-solid fa-shield-alt',
    //   '대출': 'fa-solid fa-hand-holding-usd',
    //   '교육': 'fa-solid fa-book',
    //   '저축': 'fa-solid fa-piggy-bank',
    //   '생활/마트': 'fa-solid fa-shopping-basket',
    //   '기타': 'fa-solid fa-ellipsis-h'
    // };
    // 컴포넌트에 사용할 데이터와 기능 반환
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
/* 스타일링이 scoped로 지정되어 해당 컴포넌트에만 적용됩니다. */

/* 캔버스 스타일 */
canvas {
  width: 100%;
  height: 400px;
}

/* 세부 정보 컨테이너 스타일 */
.details-container {
  margin-top: 40px; /* 상단 여백 */
  text-align: center; /* 가운데 정렬 */
}

/* 세부 정보 테이블 스타일 */
.details-table {
  margin: 0 auto; /* 중앙 정렬 */
  width: 80%;
  max-width: 600px; /* 최대 너비 지정 */
  border-collapse: collapse; /* 테이블 셀 경계를 합칩니다. */
}

/* 테이블 로우 스타일 */
.table-row {
  display: flex; /* 플렉스 레이아웃 사용 */
  justify-content: space-between; /* 로우 요소 간 간격 벌리기 */
  padding: 10px 0; /* 로우 내부 패딩 설정 */
  border-bottom: 1px solid #ddd; /* 로우 간 구분선 설정 */
}

/* 테이블 셀 스타일 */
.table-cell {
  flex: 1; /* 플렉스 요소를 동일한 너비로 설정 */
  text-align: center; /* 가운데 정렬 */
}

/* 백분율 표시 셀 스타일 */
.percentage {
  font-weight: bold; /* 굵은 글꼴 */
  color: #fff; /* 글꼴 색상 */
  padding: 5px; /* 내부 패딩 설정 */
  border-radius: 8px; /* 둥근 모서리 설정 */
}

/* 수입 금액 색상 */
.amount.income {
  color: #4caf50; /* 초록색 */
}

/* 지출 금액 색상 */
.amount.expense {
  color: #ff5722; /* 빨간색 */
}

/* 하단 footer 스타일 */
.footer {
  margin-top: 40px; /* 상단 여백 설정 */
  text-align: center; /* 가운데 정렬 */
}

.footer p {
  margin: 0; /* 마진 제거 */
  padding: 10px; /* 내부 패딩 설정 */
  background-color: #35495e; /* 배경색 지정 */
  color: white; /* 글꼴 색상 */
  position: fixed; /* 고정 위치 설정 */
  width: 100%; /* 전체 너비 설정 */
  bottom: 0; /* 하단 위치로 지정 */
  left: 0; /* 좌측 위치로 지정 */
}

/* 버튼 스타일 */
button {
  margin: 10px; /* 마진 설정 */
  padding: 10px 20px; /* 패딩 설정 */
  border: none; /* 테두리 제거 */
  background-color: #35495e; /* 배경색 지정 */
  color: white; /* 글꼴 색상 */
  cursor: pointer; /* 커서 타입 설정 */
}

/* 버튼 호버 효과 스타일 */
button:hover {
  background-color: #2c3e50; /* 호버 시 배경색 변경 */
}

/* 차트와 목표 달성율 표시 컨테이너 스타일 */
.chart-and-target {
  display: flex; /* 플렉스 레이아웃 사용 */
  align-items: center; /* 아이템 세로 정렬 */
  justify-content: center; /* 아이템 가로 정렬 */
}

/* 목표 달성율 표시 요소 스타일 */
.target-achievement {
  margin-left: 20px; /* 왼쪽 여백 설정 */
}
</style>
