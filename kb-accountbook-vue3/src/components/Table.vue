<template>
  <div class="table-container">
    <div class="filters" style="width: 80%">
      <!-- 필터 코드 생략 -->

    </div>

    <br></br>
    
    <table style="width: 80%">
      <thead>
        <tr>
          <th>선택</th>
          <th>번호</th>
          <th><font-awesome-icon icon="calendar-alt" /> 날짜</th>
          <th><font-awesome-icon icon="tags" /> 분류</th>
          <th><font-awesome-icon icon="list" /> 카테고리</th>
          <th><font-awesome-icon icon="credit-card" /> 결제 수단</th>
          <th><font-awesome-icon icon="won-sign" /> 금액</th>
          <th><font-awesome-icon icon="sticky-note" /> 메모</th>
          <th><font-awesome-icon icon="map-pin" /> 고정 지출</th> <!-- 여기에 고정 지출 추가 -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in filteredBudget" :key="item.id">
          <td><input type="checkbox" v-model="selectedItems" :value="item.id" /></td>
          <td>{{ index + 1 }}</td>
          <td>{{ item.date }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.paymentMethod }}</td>
          <td>{{ formatCurrency(item.amount) }}</td>
          <td>{{ item.memo }}</td>
          <td>{{ item.duration === 'weekly' ? '매주' : 
                item.duration === 'monthly' ? '매달' : 
                item.duration === 'quarterly' ? '3개월' : 
                item.duration === 'semiannually' ? '6개월' : 
                item.duration === 'yearly' ? '1년' : '' }}</td>
        </tr>
      </tbody>
    </table>


    <br>

    <!-- 선택된 항목 삭제 버튼을 표의 맨 오른쪽으로 이동 -->
    <div style="width: 80%; display: flex; justify-content: flex-end; margin-top: 10px;">
      <button @click="deleteSelected" style="border-radius: 5px; padding: 5px;">선택된 항목 삭제</button>
    </div>
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
      },
      selectedItems: []
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
    deleteSelected() {
      this.selectedItems.forEach(id => {
        axios.delete(`http://localhost:3000/budget/${id}`)
          .then(() => {
            const index = this.budget.findIndex(item => item.id === id);
            if (index !== -1) {
              this.budget.splice(index, 1);
            }
          })
          .catch(error => {
            console.error('Error deleting row:', error);
          });
      });
      this.selectedItems = [];
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

.filters,
.filters label,
.filters select,
.filters input {
  width: 100px;
  text-align: center;
  margin-bottom: 5px; /* 필터 레이블과 필터 간격 조정 */
}

table {
  width: 100%;
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
