<template>
  <div class="statistics-page">
    <div class="toggle-buttons">
      <button @click="toggleView('income')">
        <i class="fa-solid fa-coins"></i> &nbsp; 소비 통계
      </button>
      <button @click="toggleView('expense')">
        <i class="fa-solid fa-wallet"></i> &nbsp; 지출 통계
      </button>
    </div>
    <div v-if="showIncome">
      <h2 class="details-container">
        <i class="fa-solid fa-coins"></i> &nbsp; 소비
      </h2>
      <br />
      <div class="chart-container">
        <PieChart v-if="incomeChartData" :chartData="incomeChartData" />
        <br /><br />
      </div>
      <div class="details-container">
        <div class="details-table-wrapper">
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
              <div class="table-cell category">
                <i :class="getCategoryIcon(key)"></i> &nbsp; {{ key }}
              </div>
              <div class="table-cell amount income">
                {{ formatAmount(value.amount) }}원
              </div>
            </div>
          </div>
          <div v-if="showCategoryDetail" class="category-detail">
            <CircularProgressBar
              :percentage="
                parseFloat(
                  calculateAchievement(
                    selectedCategoryData.goal,
                    selectedCategoryData.actual
                  )
                )
              "
              :details="`목표: ${formatAmount(selectedCategoryData.goal)}`"
              :risk="selectedCategoryRisk"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="showExpense">
      <h2 class="details-container">
        <i class="fa-solid fa-wallet"></i> &nbsp; 지출
      </h2>
      <br />
      <div class="chart-and-target">
        <div class="chart-container">
          <PieChart v-if="expenseChartData" :chartData="expenseChartData" />
        </div>
        <div class="target-achievement">
          <CircularProgressBar
            :percentage="
              parseFloat(
                calculateAchievement(totalGoalAmount, totalActualExpense)
              )
            "
            :details="`목표: ${formatAmount(totalGoalAmount)}`"
            :risk="calculateRisk(totalGoalAmount, totalActualExpense)"
          />
        </div>
      </div>
      <div class="details-container">
        <br />
        <div class="details-table-wrapper">
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
              <div class="table-cell">
                <button @click="selectCategory(key)">소비 확인</button>
              </div>
            </div>
          </div>
          <div v-if="showCategoryDetail" class="category-detail">
            <CircularProgressBar
              :percentage="
                parseFloat(
                  calculateAchievement(
                    selectedCategoryData.goal,
                    selectedCategoryData.actual
                  )
                )
              "
              :details="`목표: ${formatAmount(selectedCategoryData.goal)}`"
              :risk="selectedCategoryRisk"
            />
          </div>
        </div>
      </div>
    </div>
    <p v-if="!incomeChartData && !expenseChartData">Loading...</p>
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
      totalGoalAmount,
      totalActualExpense,
      selectedCategory,
      selectedCategoryData,
      selectCategory,
      selectedCategoryRisk,
      showCategoryDetail, // 상세보기 상태 추가
    } = useStatistics();

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

    const getCategoryIcon = (category) => {
      return categoryIconMap[category] || 'fa-solid fa-question';
    };

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
      totalGoalAmount,
      totalActualExpense,
      getCategoryIcon,
      selectCategory,
      selectedCategory,
      selectedCategoryData,
      selectedCategoryRisk,
      showCategoryDetail, // 상세보기 상태 추가
    };
  },
};
</script>

<style scoped>
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

.details-table-wrapper {
  display: flex;
  justify-content: center;
}

.details-table {
  width: 70%;
  border-collapse: collapse;
}

.category-detail {
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
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
  padding: 8px 20px;
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
