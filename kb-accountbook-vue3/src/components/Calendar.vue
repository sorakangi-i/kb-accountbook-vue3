<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <button @click="prevMonth">←</button>
      <div class="current-month">
        {{ calendarStore.currentYear }}년 {{ calendarStore.currentMonth }}월
        <button class="dropdown-button" @click="toggleMonthPicker">▼</button>
      </div>
      <button @click="nextMonth">→</button>
    </div>
    <div class="month-picker" v-if="showPicker">
      <label for="year">연도:&nbsp;</label>
      <select v-model="selectedYear" id="year">
        <option v-for="year in years" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
      <label for="month">&nbsp;&nbsp;월:&nbsp;</label>
      <select v-model="selectedMonth" id="month">
        <option v-for="month in months" :key="month" :value="month">
          {{ month }}
        </option>
      </select>
      <button class="move-button" @click="goToSelectedMonth">이동</button>
    </div>
    <div class="calendar">
      <div class="day" v-for="day in days" :key="day">{{ day }}</div>
      <div
        class="date"
        v-for="date in calendarStore.calendarDays"
        :key="date.date ? date.date.getDate() : 'empty'"
      >
        <span v-if="date.date">{{ date.date.getDate() }}</span>
        <div
          v-if="date.hasBudget"
          class="budget-icon"
          @click="toggleDetails(date.date)"
        >
          ●
        </div>
      </div>
    </div>
    <TransactionDetails
      v-if="showDetails"
      :transactions="selectedTransactions"
      :transactionDate="selectedDate"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCalendarStore } from '@/stores/calendarStore';
import TransactionDetails from '@/components/TransactionDetails.vue';

const calendarStore = useCalendarStore();

const showPicker = ref(false);
const selectedYear = ref(calendarStore.currentYear);
const selectedMonth = ref(calendarStore.currentMonth);
const showDetails = ref(false);
const selectedTransactions = ref([]);
const selectedDate = ref('');

const years = Array.from({ length: 31 }, (_, i) => 2020 + i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const days = ['일', '월', '화', '수', '목', '금', '토'];

onMounted(() => {
  calendarStore.fetchBudgetData();
});

const toggleMonthPicker = () => {
  showPicker.value = !showPicker.value;
};

const goToSelectedMonth = () => {
  calendarStore.goToMonth(selectedYear.value, selectedMonth.value);
  showPicker.value = false;
};

const nextMonth = () => {
  calendarStore.nextMonth();
};

const prevMonth = () => {
  calendarStore.prevMonth();
};

const toggleDetails = (date) => {
  const dateString = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  if (selectedDate.value === dateString && showDetails.value) {
    showDetails.value = false;
  } else {
    selectedDate.value = dateString;
    selectedTransactions.value = calendarStore.budgetData.filter(
      (transaction) =>
        new Date(transaction.date).toDateString() === date.toDateString()
    );
    showDetails.value = true;
  }
};
</script>

<style scoped>
.calendar-container {
  max-width: 70%;
  margin: 0 auto;
  padding: 20px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 1.2em;
}

.month-picker {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.move-button {
  margin-left: 15px;
}

.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  border: 1px solid #ddd;
}

.day,
.date {
  text-align: center;
  padding: 10px 0;
  border: 1px solid #ddd;
  box-sizing: border-box;
}

.day {
  background-color: #f0f0f0;
  font-weight: bold;
}

.date {
  background-color: #fff;
  position: relative;
  text-align: left;
  padding: 50px;
}

.date span {
  position: absolute;
  top: 5px;
  left: 5px;
}

.budget-icon {
  color: red;
  font-size: 12px;
  cursor: pointer;
  position: absolute;
  bottom: 5px;
  right: 5px;
}

.transaction-details {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.transaction-header {
  font-weight: bold;
  margin-bottom: 10px;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}

.transaction-memo {
  text-align: right;
}
</style>
