<template>
  <div class="table-container">
    <div class="filters">
      <label for="date-filter">날짜:</label>
      <input
        type="date"
        id="date-filter"
        v-model="filters.date"
        @change="applyFilters"
      />

      <label for="type-filter">분류:</label>
      <select id="type-filter" v-model="filters.type" @change="applyFilters">
        <option value="">전체</option>
        <option value="지출">지출</option>
        <option value="수입">수입</option>
      </select>

      <label for="category-filter">카테고리:</label>
      <select
        id="category-filter"
        v-model="filters.category"
        @change="applyFilters"
      >
        <option value="">전체</option>
        <option
          v-for="category in expenseCategories"
          :key="category.id"
          :value="category.name"
        >
          {{ category.name }}
        </option>
        <option
          v-for="category in incomeCategories"
          :key="category.id"
          :value="category.name"
        >
          {{ category.name }}
        </option>
      </select>

      <label for="payment-method-filter">결제 수단:</label>
      <select
        id="payment-method-filter"
        v-model="filters.paymentMethod"
        @change="applyFilters"
      >
        <option value="">전체</option>
        <option
          v-for="method in paymentMethods"
          :key="method.id"
          :value="method.name"
        >
          {{ method.name }}
        </option>
      </select>
    </div>

    <table>
      <thead>
        <tr>
          <th>날짜</th>
          <th>분류</th>
          <th>카테고리</th>
          <th>결제 수단</th>
          <th>금액</th>
          <th>메모</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredBudget" :key="item.id">
          <td>{{ item.date }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.paymentMethod }}</td>
          <td>{{ item.amount }}</td>
          <td>{{ item.memo }}</td>
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
        paymentMethod: '',
      },
    };
  },
  computed: {
    filteredBudget() {
      return this.budget.filter((item) => {
        return (
          (!this.filters.date || item.date === this.filters.date) &&
          (!this.filters.type || item.type === this.filters.type) &&
          (!this.filters.category || item.category === this.filters.category) &&
          (!this.filters.paymentMethod ||
            item.paymentMethod === this.filters.paymentMethod)
        );
      });
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const budgetResponse = await axios.get('http://localhost:3000/budget');
        const expenseCategoriesResponse = await axios.get(
          'http://localhost:3000/expenseCategories'
        );
        const incomeCategoriesResponse = await axios.get(
          'http://localhost:3000/incomeCategories'
        );
        const paymentMethodsResponse = await axios.get(
          'http://localhost:3000/paymentMethods'
        );

        this.budget = budgetResponse.data;
        this.expenseCategories = expenseCategoriesResponse.data;
        this.incomeCategories = incomeCategoriesResponse.data;
        this.paymentMethods = paymentMethodsResponse.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    applyFilters() {
      // 필터가 변경되었을 때 필터링된 데이터를 업데이트
      this.filteredBudget;
    },
  },
};
</script>

<style scoped>
.table-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

table {
  width: 80%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

th {
  background-color: #f2f2f2;
}
</style>
