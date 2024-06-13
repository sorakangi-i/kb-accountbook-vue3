<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <button @click="prevMonth">←</button>
      <div class="current-month">
        {{ calendarStore.currentYear }}년
        {{ calendarStore.currentMonth }}월&nbsp;
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
        @click="selectDate(date.date)"
      >
        <span v-if="date.date">{{ date.date.getDate() }}</span>
        <div v-if="date.hasBudget" class="budget-icon">●</div>
      </div>
    </div>
    <TransactionDetails />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCalendarStore } from '@/stores/calendarStore'; //
import { useTransactionStore } from '@/stores/transactionStore';
import TransactionDetails from '@/components/TransactionDetails.vue';

const calendarStore = useCalendarStore();
const transactionStore = useTransactionStore();

const showPicker = ref(false);
const selectedYear = ref(calendarStore.currentYear);
const selectedMonth = ref(calendarStore.currentMonth);
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

const selectDate = (date) => {
  if (!date) return;
  const selectedDateString = date.toISOString().split('T')[0];

  if (transactionStore.selectedDate === selectedDateString) {
    // 같은 날짜를 클릭하면 세부 내역을 숨깁니다.
    transactionStore.setSelectedDate('');
    transactionStore.setSelectedTransactions([]);
    return;
  }

  const filteredTransactions = calendarStore.budgetData.filter(
    (transaction) => {
      if (transaction.period) {
        const startDate = new Date(transaction.date);
        const dayDifference = Math.floor(
          (date - startDate) / (1000 * 60 * 60 * 24)
        );

        switch (transaction.duration) {
          case 'weekly':
            if (date.getDay() === startDate.getDay()) return true;
            break;
          case 'monthly':
            if (startDate.getDate() === date.getDate()) return true;
            break;
          case 'quarterly':
            if (
              startDate.getDate() === date.getDate() &&
              Math.floor(dayDifference / 91) % 3 === 0
            )
              return true;
            break;
          case 'semiannually':
            if (
              startDate.getDate() === date.getDate() &&
              Math.floor(dayDifference / 182) % 2 === 0
            )
              return true;
            break;
          case 'yearly':
            if (
              startDate.getDate() === date.getDate() &&
              startDate.getMonth() === date.getMonth()
            )
              return true;
            break;
        }
      }
      return transaction.date === selectedDateString;
    }
  );

  transactionStore.setSelectedDate(selectedDateString);
  transactionStore.setSelectedTransactions(filteredTransactions);
};
</script>

<style scoped>
.calendar-container {
  max-width: 70%;
  margin: 0 auto;
  padding: 20px;
  margin-top: 50px;
  border: 1px solid lightgray;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 1.2em;
}

.calendar-header button {
  font-size: 0.9em; /* 버튼 크기를 줄이기 */
}

.dropdown-button {
  font-size: 15px;
}

.month-picker {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.move-button {
  margin-left: 13px;
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
  cursor: pointer;
}

.date span {
  position: absolute;
  top: 5px;
  left: 5px;
}

.budget-icon {
  color: #00fa9a;
  font-size: 15px;
  position: absolute;
  bottom: 5px;
  right: 7px;
}

.day:nth-child(1) {
  color: red; /* 일요일 색상 */
}

.day:nth-child(7) {
  color: blue; /* 토요일 색상 */
}

.day:nth-child(2),
.day:nth-child(3),
.day:nth-child(4),
.day:nth-child(5),
.day:nth-child(6) {
  color: gray; /* 월요일부터 금요일까지 색상 */
}
</style>
