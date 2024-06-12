<template>
  <div v-if="transaction" class="transaction-details">
    <div class="transaction-header">{{ transactionDate }}의 내역입니다.</div>
    <!-- item: 임시변수, 배열 안에 있는 요소인 객체 하나하나를 의미-->
    <div class="transaction-item" v-for="item in transactions" :key="item.id">
      <div>
        {{ item.type === '수입' ? '입금' : '출금' }}
        {{ item.amount.toLocaleString() }} 원
      </div>
      <div class="transaction-memo">{{ item.memo }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'; // ref와 기능은 동일하나 watch를 쓰지 않고 간결하게 쓸 수 있음
import { useTransactionStore } from '@/stores/transactionStore';

// Pinia 스토어를 사용하여 데이터 가져오기
const transactionStore = useTransactionStore(); // 스토어에서 정보 가져오기

const transactionDate = computed(() => transactionStore.selectedDate); // 달력에서 선택한 날짜
const transactions = computed(() => transactionStore.selectedTransactions); // 거래 내역에 적힌 정보들

const transaction = computed(() =>
  transactions.value.length ? transactions.value : null
);

// const transaction = computed(() => {
//   return transactions.value && transactions.value.length > 0
//     ? transactions.value
//     : null;
// });
</script>

<style scoped>
.transaction-details {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.transaction-header {
  font-weight: bold;
  margin-bottom: 10px;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}

.transaction-memo {
  text-align: right;
}
</style>
