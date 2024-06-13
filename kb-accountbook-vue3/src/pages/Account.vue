<template>
  <div class="account">
    <QuickAddTransaction />
    <br />
    <h1 class="title"><b>수입 및 지출 내역</b></h1>
    <br />
    <div class="table-container">
      <Table />
    </div>
  </div>
</template>

<script>
import QuickAddTransaction from '@/components/QuickAddTransaction.vue';
import Table from '@/components/Table.vue';

export default {
  components: {
    Table,
    QuickAddTransaction,
  },
};
</script>

<style scoped>
.account {
  padding: 20px;
}

/* 표 헤더와 열 이름에 대한 스타일 */
th {
  text-align: center; /* 열 이름 가운데 정렬 */
}

/* 표 셀에 대한 스타일 */
td {
  text-align: center; /* 셀 내용 가운데 정렬 */
}

.table-container {
  overflow-x: auto; /* 가로 스크롤을 생성하고, 필요할 때만 표시 */
}
</style>
