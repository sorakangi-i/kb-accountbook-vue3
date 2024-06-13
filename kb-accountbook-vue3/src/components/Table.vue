<template>
  <div class="table-container">
    <div class="filters">
      <label class="filter-label" for="date-filter"><font-awesome-icon icon="calendar-alt" /> 날짜:</label>
      <input type="date" id="date-filter" v-model="filters.date" @change="applyFilters" />

      <label class="filter-label" for="type-filter"><font-awesome-icon icon="tags" /> 분류:</label>
      <select id="type-filter" v-model="filters.type" @change="applyFilters">
        <option value="">전체</option>
        <option value="지출">지출</option>
        <option value="수입">수입</option>
      </select>

      <label for="category-filter"><font-awesome-icon icon="list" /> 카테고리:</label>
      <select id="category-filter" v-model="filters.category" @change="applyFilters">
        <option value="">전체</option>
        <optgroup label="지출">
          <option v-for="category in expenseCategories" :key="category.id" :value="category.name">{{ category.name }}</option>
        </optgroup>
        <optgroup label="수입">
          <option v-for="category in incomeCategories" :key="category.id" :value="category.name">{{ category.name }}</option>
        </optgroup>
      </select>

      <label class="filter-label" for="payment-method-filter"><font-awesome-icon icon="credit-card" /> 결제 수단:</label>
      <select id="payment-method-filter" v-model="filters.paymentMethod" @change="applyFilters">
        <option value="">전체</option>
        <option v-for="method in paymentMethods" :key="method.id" :value="method.name">{{ method.name }}</option>
      </select>
    </div>

    <table>
      <thead>
        <tr>
          <th>번호</th>
          <th><font-awesome-icon icon="calendar-alt" /> 날짜</th>
          <th><font-awesome-icon icon="tags" /> 분류</th>
          <th><font-awesome-icon icon="list" /> 카테고리</th>
          <th><font-awesome-icon icon="credit-card" /> 결제 수단</th>
          <th><font-awesome-icon icon="won-sign" /> 금액</th>
          <th><font-awesome-icon icon="sticky-note" /> 메모</th>
          <th>삭제</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in filteredBudget" :key="item.id">
          <td>{{ index + 1 }}</td>
          <td>{{ item.date }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.paymentMethod }}</td>
          <td>{{ formatCurrency(item.amount) }}</td>
          <td>{{ item.memo }}</td>
          <td>
            <button @click="deleteRow(item.id)">삭제</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      budget: [],
      expenseCategories: [],
      incomeCategories: [],
      paymentMethods: [],
      filters: {
        date: '',
        type: '',
        category: '',
        paymentMethod: ''
      }
    };
  },
  computed: {
    filteredBudget() {
      return this.budget
        .filter(item => {
          return (
            (!this.filters.date || item.date === this.filters.date) &&
            (!this.filters.type || item.type === this.filters.type) &&
            (!this.filters.category || item.category === this.filters.category) &&
            (!this.filters.paymentMethod || item.paymentMethod === this.filters.paymentMethod)
          );
        })
        .sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const budgetResponse = await axios.get('http://localhost:3000/budget');
        const expenseCategoriesResponse = await axios.get('http://localhost:3000/expenseCategories');
        const incomeCategoriesResponse = await axios.get('http://localhost:3000/incomeCategories');
        const paymentMethodsResponse = await axios.get('http://localhost:3000/paymentMethods');
        
        this.budget = budgetResponse.data;
        this.expenseCategories = expenseCategoriesResponse.data;
        this.incomeCategories = incomeCategoriesResponse.data;
        this.paymentMethods = paymentMethodsResponse.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    applyFilters() {
      this.filteredBudget;
    },
    formatCurrency(amount) {
      return Number(amount).toLocaleString();
    },
    deleteRow(id) {
      const index = this.budget.findIndex(item => item.id === id);
      if (index !== -1) {
        this.budget.splice(index, 1);
      }
    }
  }
}
</script>

<style scoped>
.table-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.filters {
  width: 80%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.filters label,
.filters select,
.filters input {
  width: 20%;
  text-align: center;
}

table {
  width: 80%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

th {
  background-color: #e9ecef;
}
</style>
