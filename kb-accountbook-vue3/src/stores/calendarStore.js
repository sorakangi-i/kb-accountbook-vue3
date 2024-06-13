import { defineStore } from 'pinia';
import axios from 'axios';

//calendar라는 이름의 저장소 생성
//월, 요일 : 0부터 년, 일 : 1부터 그대로
export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    //state는 함수의 초기 상태를 리턴
    currentYear: new Date().getFullYear(), //리턴된 현재 년도를 저장
    currentMonth: new Date().getMonth() + 1, //리턴된 현재 월을 저장하는데 함수 리턴이 0부터 시작하므로 + 1
    budgetData: [], //예산 데이터를 서버에서 가져와서 이 배열에 저장 ex) { date: '2024-06-12', amount: 100 }
  }),

  //getters: state에 저장된 데이터를 변형해줌 데이터를 그대로 쓸 경우 getter 필요 X
  getters: {
    //함수 호출 시 매개변수명이 무엇이든 state 객체를 자동으로 전달함
    daysInMonth: (state) => {
      //day = 0 == 다음 달의 0번째 날 == 이번달의 마지막 날 ex) 2024-06-30
      //getDate()는 해당 날짜 객체의 '일'을 리턴 ex) 6월 30일이면 30일을 리턴
      return new Date(state.currentYear, state.currentMonth, 0).getDate(); //new Date(year, month, day)
    },
    //해당 달의 1일이 무슨 요일인지 계산 ex) 0: 일요일, 1: 월요일
    //화면에 표시할 때는 사람이 이해하기 쉬운 1부터 12까지의 월을 사용하기 위해 +1
    // 계산하기 위해서는 0부터 11까지의 값을 사용해야 하므로 -1
    firstDayOfMonth: (state) => {
      return new Date(state.currentYear, state.currentMonth - 1, 1).getDay();
    },
    //달력에 표시될 날들
    calendarDays: (state) => {
      const days = []; // 빈 배열
      const totalDays = state.daysInMonth + state.firstDayOfMonth; // 해당 달에 며칠 있는지 + 해당 달의 1일이 무슨 요일인지 ex. 2024년 6월이면 35

      for (let i = 0; i < totalDays; i++) {
        if (i < state.firstDayOfMonth) {
          days.push({ date: null, hasBudget: false }); // 첫날 요일의 숫자 -1 만큼 빈 셀 추가
        } else {
          const date = new Date(
            state.currentYear,
            state.currentMonth - 1, // 월을 0~11로 인덱싱하기 때문에 1을 뺌
            i - state.firstDayOfMonth + 1 // 2024년 6월이면 35 - 6 + 1 = 30일
          );

          const hasBudget = state.budgetData.some(
            (b) => new Date(b.date).toDateString() === date.toDateString() // 프로그램이 이해할 수 있도록 객체 형태로 바꿔줌 -> 시간은 필요 없기에 날짜만 남겨두는 toDateString 사용
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