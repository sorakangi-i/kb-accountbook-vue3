<template>
  <!-- 통계 페이지 템플릿 -->
  <div class="statistics-page">
    <!-- 수입, 지출 토글 버튼 -->
    <div class="toggle-buttons">
      <button @click="toggleView('income')">
        <i class="fa-solid fa-coins"></i> &nbsp; 소비 통계
      </button>
      <button @click="toggleView('expense')">
        <i class="fa-solid fa-wallet"></i> &nbsp; 지출 통계
      </button>
    </div>
    <!-- 수입 섹션 -->
    <div v-if="showIncome">
      <h2 class="details-container">
        <i class="fa-solid fa-coins"></i> &nbsp; 소비
      </h2>
      <!-- 수입 원형 차트 -->
      <br />

      <div class="chart-container">
        <PieChart v-if="incomeChartData" :chartData="incomeChartData" />
        <br />
        <br />
      </div>
      <!-- 수입 세부 정보 -->
      <div class="details-container">
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
            <!-- 수입 세부 정보 테이블에서 카테고리를 설정하는 방법! -->
            <div class="table-cell category">
              <i :class="getCategoryIcon(key)"></i> &nbsp; {{ key }}
            </div>
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
        <i class="fa-solid fa-wallet"></i> &nbsp; 지출
      </h2>
      <br />

      <!-- 지출 원형 차트와 목표 달성율 표시 -->
      <div class="chart-and-target">
        <div class="chart-container">
          <PieChart v-if="expenseChartData" :chartData="expenseChartData" />
        </div>
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
        <!-- 지출 세부 정보 테이블 -->
        <br />
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
            <div class="table-cell category">
              <i :class="getCategoryIcon(key)"></i> &nbsp; {{ key }}
            </div>
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
      <p>&copy; 2024 My Financial Dashboard</p>
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
    const categoryIconMap = {
      월급: 'fa-solid fa-dollar-sign',
      용돈: 'fa-solid fa-sack-dollar',
      환급: 'fa-solid fa-money-bills',
      기타: 'fa-solid fa-ellipsis',
      온라인쇼핑: 'fa-solid fa-cart-shopping',
      '패션/쇼핑': 'fa-solid fa-shirt',
      식비: 'fa-solid fa-utensils',
      '카페/간식': 'fa-solid fa-mug-saucer',
      주거: 'fa-solid fa-house',
      통신: 'fa-solid fa-phone',
      '교통/차량': 'fa-solid fa-car',
      '의료/건강': 'fa-solid fa-notes-medical',
      보험: 'fa-solid fa-shield',
      대출: 'fa-solid fa-hand-holding-dollar',
      교육: 'fa-solid fa-book',
      저축: 'fa-solid fa-piggy-bank',
      '생활/마트': 'fa-solid fa-basket-shopping',
      기타: 'fa-solid fa-ellipsis',
    };

    // 카테고리에 맞는 아이콘 클래스를 반환하는 함수
    const getCategoryIcon = (category) => {
      return categoryIconMap[category] || 'fa-solid fa-question';
    };

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
      getCategoryIcon, // getCategoryIcon 함수 반환
    };
  },
};
</script>

<style scoped>
/* 스타일링이 scoped로 지정되어 해당 컴포넌트에만 적용됩니다. */

.statistics-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.toggle-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

canvas {
  width: 100%;
  height: 400px;
}

.details-container {
  margin-top: 40px;
  text-align: center;
}

.chart-container {
  margin-bottom: 40px;
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
  color: #4caf50;
}

.amount.expense {
  color: #ff5722;
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
  justify-content: space-around;
  flex-wrap: wrap;
}

.target-achievement {
  margin: 20px;
}
</style>
