<template>
  <div>
    <!-- 거래 내역이 있는 날짜를 선택하면 상세 내역이 나옴 -->
    <div v-if="transaction" class="transaction-details">
      <div class="transaction-header">{{ transactionDate }}의 내역입니다.</div>
      <!-- 특정 날짜에 여러개의 거래가 있을 경우 변경 사항이 있을때 그 부분만 랜더링 위해 key값 줌 -->
      <div class="transaction-item" v-for="item in transactions" :key="item.id">
        <div>
          {{ item.type === '수입' ? '입금' : '출금' }}
          {{ item.amount.toLocaleString() }} 원
        </div>
        <div class="transaction-memo">{{ item.memo }}</div>
      </div>
    </div>
    <!-- 거래 내역이 없는 날짜를 선택하면 나오는 문구 -->
    <div v-else-if="transactionStore.selectedDate" class="transaction-null">
      <p>현재 내역이 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'; //반응형으로 만들어주는 함수 computed
import { useTransactionStore } from '@/stores/transactionStore'; //달력에 있는 데이터 읽는 store 가져옴

const transactionStore = useTransactionStore(); //불러온 store 함수를 값으로 사용하기 위해 선언

const transactionDate = computed(() => transactionStore.selectedDate); //선택된 날짜
const transactions = computed(() => transactionStore.selectedTransactions); //선택된 날짜의 거래 내역

const transaction = computed(() =>
  transactions.value.length ? transactions.value : null
); //거래 내역이 한글자라도 적혀 있다면 return 하고 아니면 null 처리
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

.transaction-null {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>
