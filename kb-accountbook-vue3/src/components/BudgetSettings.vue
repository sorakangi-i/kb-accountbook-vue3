<template>
  <div>
    <div class="form-row">
      <span class="th">
        <font-awesome-icon icon="coins" class="fa_icon" />
        <label for="selectedCategory">카테고리</label>
      </span>
      <span class="td">
        <select
          id="selectedCategory"
          v-model="selectedCategory"
          class="category-select"
        >
          <option value="" disabled selected>- 선택해주세요</option>
          <option
            v-for="category in availableCategories"
            :key="category.id"
            :value="category.name"
          >
            {{ category.name }}
          </option>
        </select>
        <button type="button" @click="toggleNewCategoryInput">
          {{ showNewCategoryInput ? '추가 취소' : '추가' }}
        </button>
      </span>
    </div>
    <div v-if="showNewCategoryInput" class="form-row">
      <span class="th">
        <font-awesome-icon icon="plus" class="fa_icon" />
        <label for="newCategory">카테고리 추가</label>
      </span>
      <span class="td">
        <input
          type="text"
          id="newCategory"
          v-model="newCategory"
          placeholder="새 카테고리 입력"
        />
        <button type="button" @click="confirmAddCategory">확인</button>
        <button type="button" @click="cancelAddCategory" class="cancel">
          취소
        </button>
      </span>
    </div>

    <div v-for="(budget, index) in budgets" :key="index" class="form-row">
      <span class="th">
        <label>
          <font-awesome-icon icon="bullseye" class="fa_icon" />
          <span class="color">{{ budget.category }}</span>
          <br />
          목표 설정
        </label>
      </span>

      <span class="td">
        <input
          type="text"
          v-model="budget.amount"
          @input="formatBudgetAmount(index)"
        />
        원
        <button type="button" @click="removeBudget(index)">삭제</button>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    budgets: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      expenseCategories: [
        { id: '1', name: '온라인쇼핑' },
        { id: '2', name: '패션/쇼핑' },
        { id: '3', name: '식비' },
        { id: '4', name: '카페/간식' },
        { id: '5', name: '주거' },
        { id: '6', name: '통신' },
        { id: '7', name: '교통/차량' },
        { id: '8', name: '의료/건강' },
        { id: '9', name: '보험' },
        { id: '10', name: '대출' },
        { id: '11', name: '교육' },
        { id: '12', name: '저축' },
        { id: '13', name: '생활/마트' },
        { id: '14', name: '기타' },
      ],
      selectedCategory: '',
      showNewCategoryInput: false,
      newCategory: '',
    };
  },
  computed: {
    availableCategories() {
      const selectedCategories = this.budgets.map((budget) => budget.category);
      return this.expenseCategories.filter(
        (category) => !selectedCategories.includes(category.name)
      );
    },
  },
  watch: {
    selectedCategory(newCategory) {
      if (newCategory) {
        if (!this.budgets.some((budget) => budget.category === newCategory)) {
          this.budgets.push({ category: newCategory, amount: 0 });
        }
        this.selectedCategory = '';
      }
    },
  },
  methods: {
    formatNumber(value) {
      if (typeof value !== 'number') {
        value = parseInt(value.replace(/,/g, ''));
      }
      return isNaN(value) ? '' : value.toLocaleString();
    },
    parseNumber(value) {
      return parseInt(value.replace(/,/g, '')) || 0;
    },
    formatBudgetAmount(index) {
      this.budgets[index].amount = this.parseNumber(this.budgets[index].amount);
      this.budgets[index].amount = this.formatNumber(
        this.budgets[index].amount
      );
    },
    toggleNewCategoryInput() {
      this.showNewCategoryInput = !this.showNewCategoryInput;
    },
    confirmAddCategory() {
      const newId = (this.expenseCategories.length + 1).toString();
      this.expenseCategories.push({ id: newId, name: this.newCategory });
      this.newCategory = '';
      this.showNewCategoryInput = false;
    },
    cancelAddCategory() {
      this.newCategory = '';
      this.showNewCategoryInput = false;
    },
    removeBudget(index) {
      this.budgets.splice(index, 1);
    },
  },
};
</script>

<style scoped>
.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.th {
  flex-basis: 30%;
  display: flex;
  align-items: center;
  text-align: left;
}

.td {
  flex-basis: 70%;
  display: flex;
  align-items: center;
}

.fa_icon {
  margin-right: 8px;
}

.color {
  color: #793ff3;
}

.category-select {
  width: 100%;
}

button {
  margin-left: 5px;
  min-width: 80px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 6px;
  border: none;
  background-color: #7840f2;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #571bda;
  transition: 0.3s ease-in-out;
}

.cancel {
  color: #353535;
  background-color: #e5dbff;
}
.cancel:hover {
  color: #353535;
  background-color: #c9b7f7;
}
</style>
