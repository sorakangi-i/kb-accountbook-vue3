<template>
  <div class="container">
    <h1 class="h1">빠른 거래 추가</h1>
    <form @submit.prevent="submitTransaction" class="quick-add-form">
      <div class="form-group">
        <label for="type">분류</label>
        <select v-model="type" id="type" required>
          <option
            v-for="type in budgetStore.types"
            :key="type.id"
            :value="type.name"
          >
            {{ type.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="date">날짜</label>
        <input v-model="date" type="date" id="date" required />
      </div>
      <div class="form-group">
        <label for="category">카테고리</label>
        <select v-model="category" id="category" required>
          <option v-for="cat in categories" :key="cat.id" :value="cat.name">
            {{ cat.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="paymentMethod">거래수단</label>
        <select v-model="paymentMethod" id="paymentMethod" required>
          <option
            v-for="method in budgetStore.paymentMethods"
            :key="method.id"
            :value="method.name"
          >
            {{ method.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="amount">금액</label>
        <input
          v-model="formattedAmount"
          type="text"
          id="amount"
          required
          @input="formatAmount"
          @blur="addWon"
          @focus="removeWon"
        />
      </div>
      <div class="form-group">
        <label for="memo">메모</label>
        <input v-model="memo" type="text" id="memo" />
      </div>
      <div class="form-group">
        <label for="period">고정 지출</label>
        <input v-model="period" type="checkbox" id="period" />
      </div>
      <div v-if="period" class="form-group">
        <label for="duration">주기</label>
        <select v-model="duration" id="duration" required>
          <option value="weekly">일주일</option>
          <option value="monthly">한달</option>
          <option value="quarterly">3개월</option>
          <option value="semiannually">6개월</option>
          <option value="yearly">1년</option>
        </select>
      </div>
      <button type="submit">추가</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useBudgetStore } from '@/stores/budgetStore';

const type = ref('지출'); // 초기 값을 "지출"로 설정
const date = ref(new Date().toISOString().slice(0, 10));
const category = ref('');
const paymentMethod = ref('');
const amount = ref(0);
const memo = ref('');
const period = ref(false);
const duration = ref('');

const formattedAmount = ref('');

const budgetStore = useBudgetStore();
const categories = ref([]);

// 초기화 시 "지출" 카테고리를 설정
onMounted(async () => {
  await budgetStore.fetchTypes();
  await budgetStore.fetchIncomeCategories();
  await budgetStore.fetchExpenseCategories();
  await budgetStore.fetchPaymentMethods();
  console.log('Income categories:', budgetStore.incomeCategories); // 디버깅용 로그 추가
  console.log('Expense categories:', budgetStore.expenseCategories); // 디버깅용 로그 추가

  updateCategories(type.value); // 초기 카테고리 설정
});

// type 값이 변경될 때마다 updateCategories 함수 호출
watch(type, (newValue) => {
  console.log('Type changed to:', newValue); // 디버깅용 로그 추가
  updateCategories(newValue);
});

const updateCategories = (newType) => {
  console.log('Updating categories for type:', newType); // 디버깅용 로그 추가
  if (newType === '수입') {
    categories.value = budgetStore.incomeCategories;
    console.log('Income categories set:', categories.value); // 디버깅용 로그 추가
  } else if (newType === '지출') {
    categories.value = budgetStore.expenseCategories;
    console.log('Expense categories set:', categories.value); // 디버깅용 로그 추가
  } else {
    categories.value = [];
  }
};

//진짜 모르는 부분
const formatAmount = (event) => {
  const input = event.target.value.replace(/[^0-9]/g, '');
  const numberValue = parseInt(input, 10);

  if (isNaN(numberValue)) {
    formattedAmount.value = '';
    amount.value = 0;
  } else {
    formattedAmount.value = numberValue.toLocaleString('ko-KR');
    amount.value = numberValue;
  }
};

const addWon = () => {
  if (formattedAmount.value) {
    formattedAmount.value += ' 원';
  }
};

const removeWon = () => {
  formattedAmount.value = formattedAmount.value.replace(' 원', '');
};

const submitTransaction = async () => {
  const transaction = {
    type: type.value,
    date: date.value,
    category: category.value,
    paymentMethod: paymentMethod.value,
    amount: amount.value,
    memo: memo.value,
    duration: period.value ? duration.value : null,
    period: period.value,
  };

  try {
    await budgetStore.addBudget(transaction);
    type.value = '지출'; // 초기화 시에도 "지출"로 설정
    date.value = new Date().toISOString().slice(0, 10);
    category.value = '';
    paymentMethod.value = '';
    amount.value = 0;
    memo.value = '';
    period.value = false;
    duration.value = '';
    formattedAmount.value = '';
    alert('거래가 성공적으로 추가되었습니다.');
    updateCategories(type.value); // 카테고리 재설정
  } catch (error) {
    console.error('Error adding transaction:', error);
    alert('거래 추가 중 오류가 발생했습니다.');
  }
};
</script>

<style scoped>
.container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.h1 {
  text-align: center;
}

.quick-add-form {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
  overflow-x: auto;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px;
}

.quick-add-form label {
  margin-bottom: 5px;
  text-align: center;
}

.quick-add-form input[type='date'],
.quick-add-form select,
.quick-add-form input[type='text'],
.quick-add-form input[type='number'],
.quick-add-form input[type='checkbox'] {
  width: 150px;
  text-align: center;
}

.quick-add-form button {
  align-self: flex-end;
}
</style>
