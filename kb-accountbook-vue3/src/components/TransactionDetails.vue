<template>
  <div v-if="transaction" class="transaction-details">
    <div class="transaction-header">{{ transactionDate }}의 내역입니다.</div>
    <div class="transaction-item" v-for="item in transactions" :key="item.id">
      <div>
        {{ item.type === 'income' ? '입금' : '출금' }}
        {{ item.amount.toLocaleString() }} 원
      </div>
      <div class="transaction-memo">{{ item.memo }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// props로 transactions와 선택된 날짜를 받습니다.
const props = defineProps({
  transactions: Array,
  transactionDate: String,
});

// 거래 내역이 없는 경우 null을 반환합니다.
const transaction = computed(() => {
  return props.transactions && props.transactions.length > 0
    ? props.transactions
    : null;
});
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
