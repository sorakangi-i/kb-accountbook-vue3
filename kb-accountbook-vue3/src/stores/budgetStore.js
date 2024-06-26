import { defineStore } from 'pinia';
import axios from 'axios';

export const useBudgetStore = defineStore('budget', {
  state: () => ({
    incomeCategories: [],
    expenseCategories: [],
    paymentMethods: [],
    types: [],
    budget: [],
    periodic: [],
  }),
  actions: {
    async fetchIncomeCategories() {
      try {
        const response = await axios.get(
          'http://localhost:3000/incomeCategories'
        );
        this.incomeCategories = response.data;
        console.log(
          'Income categories:',
          this.incomeCategories.map((cat) => cat.name)
        ); // 디버깅용 로그 추가
      } catch (error) {
        console.error('Error fetching income categories:', error);
      }
    },
    async fetchExpenseCategories() {
      try {
        const response = await axios.get(
          'http://localhost:3000/expenseCategories'
        );
        this.expenseCategories = response.data;
        console.log(
          'Expense categories:',
          this.expenseCategories.map((cat) => cat.name)
        ); // 디버깅용 로그 추가
      } catch (error) {
        console.error('Error fetching expense categories:', error);
      }
    },
    async fetchPaymentMethods() {
      try {
        const response = await axios.get(
          'http://localhost:3000/paymentMethods'
        );
        this.paymentMethods = response.data;
        console.log('Payment methods:', this.paymentMethods); // 디버깅용 로그 추가
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      }
    },
    async fetchTypes() {
      try {
        const response = await axios.get(
          'http://localhost:3000/types'
        );
        this.types = response.data;
        console.log('Types:', this.types); // 디버깅용 로그 추가
      } catch (error) {
        console.error('Error fetching types:', error);
      }
    },
    async fetchBudget() {
      try {
        const response = await axios.get(
          'http://localhost:3000/budget'
        );
        this.budget = response.data;
      } catch (error) {
        console.error('Error fetching budget:', error);
      }
    },
    async fetchPeriodic() {
      try {
        const response = await axios.get(
          'http://localhost:3000/periodic'
        );
        this.periodic = response.data;
      } catch (error) {
        console.error('Error fetching periodic:', error);
      }
    },
    async addBudget(transaction) {
      try {
        await axios.post(
          'http://localhost:3000/budget',
          transaction
        );
        this.fetchBudget();
      } catch (error) {
        console.error('Error adding transaction:', error);
      }
    },
  },
});
