<template>
  <div class="container">
    <!-- 빠른 거래 추가라는 제목을 표시 -->
    <h1>빠른 거래 추가</h1>
    <!-- 거래를 추가하기 위한 폼(form) -->
    <form @submit.prevent="submitTransaction">
      <!-- 분류 입력 필드 -->
      <div>
        <label for="type">분류</label>
        <input v-model="type" type="text" id="type" required />
      </div>
      <!-- 날짜 입력 필드 -->
      <div>
        <label for="date">날짜</label>
        <input v-model="date" type="date" id="date" required />
      </div>
      <!-- 카테고리 선택 필드 -->
      <div>
        <label for="category">카테고리</label>
        <select v-model="category" id="category" required>
          <!-- 카테고리 목록을 반복해서 옵션(option)으로 표시 -->
          <option v-for="cat in categories" :key="cat.id" :value="cat.name">
            {{ cat.name }}
          </option>
        </select>
      </div>
      <!-- 결제수단 선택 필드 -->
      <div>
        <label for="paymentMethod">결제수단</label>
        <select v-model="paymentMethod" id="paymentMethod" required>
          <!-- 결제수단 목록을 반복해서 옵션(option)으로 표시 -->
          <option
            v-for="method in paymentMethods"
            :key="method.id"
            :value="method.name"
          >
            {{ method.name }}
          </option>
        </select>
      </div>
      <!-- 금액 입력 필드 -->
      <div>
        <label for="amount">금액</label>
        <input
          v-model="amount"
          type="number"
          id="amount"
          required
          @input="formatAmount"
        />
      </div>
      <!-- 메모 입력 필드 -->
      <div>
        <label for="memo">메모</label>
        <input v-model="memo" type="text" id="memo" />
      </div>
      <!-- 거래 추가 버튼 -->
      <button type="submit">추가</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // Vue에서 제공하는 기능을 가져옴
import axios from 'axios'; // HTTP 요청을 보내기 위한 라이브러리

// 입력된 값을 저장하는 변수들
const type = ref('');
const date = ref(new Date().toISOString().slice(0, 10)); // 오늘 날짜로 초기화
const category = ref('');
const paymentMethod = ref('');
const amount = ref(0);
const memo = ref('');

// 카테고리와 결제수단 목록을 저장하는 변수들
const categories = ref([]);
const paymentMethods = ref([]);

// 컴포넌트가 처음 로드될 때 실행되는 함수
onMounted(async () => {
  try {
    // 서버에서 카테고리 목록을 가져옴
    const categoriesResponse = await axios.get(
      'http://localhost:3000/categories'
    );
    categories.value = categoriesResponse.data;
    // 서버에서 결제수단 목록을 가져옴
    const paymentMethodsResponse = await axios.get(
      'http://localhost:3000/paymentMethods'
    );
    paymentMethods.value = paymentMethodsResponse.data;
  } catch (error) {
    console.error('Error fetching categories or payment methods:', error);
  }
});

// 폼을 제출할 때 실행되는 함수
const submitTransaction = async () => {
  // 입력된 정보를 객체로 저장
  const transaction = {
    type: type.value,
    date: date.value,
    category: category.value,
    paymentMethod: paymentMethod.value,
    amount: amount.value,
    memo: memo.value,
  };

  try {
    // 서버에 새로운 거래를 추가
    await axios.post('http://localhost:3000/transactions', transaction);
    // 입력 필드를 초기화
    type.value = '';
    date.value = new Date().toISOString().slice(0, 10);
    category.value = '';
    paymentMethod.value = '';
    amount.value = 0;
    memo.value = '';
    alert('거래가 성공적으로 추가되었습니다.'); // 성공 메시지 표시
  } catch (error) {
    console.error('Error adding transaction:', error);
    alert('거래 추가 중 오류가 발생했습니다.'); // 오류 메시지 표시
  }
};

// 금액을 포맷하는 함수
const formatAmount = () => {
  // 금액을 '원' 단위로 표시
  const formatted = Number(amount.value).toLocaleString('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  });
  amount.value = formatted.replace('₩', '').trim(); // '₩' 기호 제거
};
</script>

<style scoped>
/* 스타일은 나중에 추가 */
</style>