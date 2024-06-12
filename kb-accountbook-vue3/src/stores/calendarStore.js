import { defineStore } from 'pinia';
import axios from 'axios';

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,
    budgetData: [],
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

          const isPeriodic = state.budgetData.some((b) => {
            if (b.period) {
              const startDate = new Date(b.date);
              if (date < startDate) return false; // 시작 날짜 이전에는 표시하지 않음
              const dayDifference = Math.floor(
                (date - startDate) / (1000 * 60 * 60 * 24)
              );
              switch (b.duration) {
                case 'weekly':
                  return date.getDay() === startDate.getDay();
                case 'monthly':
                  return startDate.getDate() === date.getDate();
                case 'quarterly':
                  return (
                    startDate.getDate() === date.getDate() &&
                    Math.floor(dayDifference / 91) % 3 === 0
                  );
                case 'semiannually':
                  return (
                    startDate.getDate() === date.getDate() &&
                    Math.floor(dayDifference / 182) % 2 === 0
                  );
                case 'yearly':
                  return (
                    startDate.getDate() === date.getDate() &&
                    startDate.getMonth() === date.getMonth()
                  );
                default:
                  return false;
              }
            }
            return false;
          });

          days.push({ date, hasBudget: hasBudget || isPeriodic });
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