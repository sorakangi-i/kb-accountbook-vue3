import { defineStore } from 'pinia';
import axios from 'axios';

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,
    budgetData: [],
    periodicData: [],
  }),
  getters: {
    daysInMonth: (state) => {
      return new Date(state.currentYear, state.currentMonth, 0).getDate();
    },
    firstDayOfMonth: (state) => {
      return new Date(state.currentYear, state.currentMonth - 1, 1).getDay();
    },
    calendarDays: (state) => {
      const days = [];
      const totalDays = state.daysInMonth + state.firstDayOfMonth;
      for (let i = 0; i < totalDays; i++) {
        if (i < state.firstDayOfMonth) {
          days.push({ date: null, hasBudget: false });
        } else {
          const date = new Date(
            state.currentYear,
            state.currentMonth - 1,
            i - state.firstDayOfMonth + 1
          );
          const hasBudget = state.budgetData.some(
            (b) => new Date(b.date).toDateString() === date.toDateString()
          );
          days.push({ date, hasBudget });
        }
      }
      return days;
    },
  },
  actions: {
    async fetchBudgetData() {
      try {
        const budgetResponse = await axios.get('http://localhost:3000/budget');
        this.budgetData = budgetResponse.data;
        const periodicResponse = await axios.get(
          'http://localhost:3000/periodic'
        );
        this.periodicData = periodicResponse.data;
      } catch (error) {
        console.error('Error fetching budget data:', error);
      }
    },
    nextMonth() {
      if (this.currentMonth === 12) {
        this.currentMonth = 1;
        this.currentYear += 1;
      } else {
        this.currentMonth += 1;
      }
    },
    prevMonth() {
      if (this.currentMonth === 1) {
        this.currentMonth = 12;
        this.currentYear -= 1;
      } else {
        this.currentMonth -= 1;
      }
    },
    goToMonth(year, month) {
      this.currentYear = year;
      this.currentMonth = month;
    },
  },
});
