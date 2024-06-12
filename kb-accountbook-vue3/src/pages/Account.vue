<template>
  <div class="account">
    <h1>Account Information</h1>
    <Table />
  </div>
</template>

<script>
import Table from '@/components/Table.vue';

export default {
  components: {
    Table
  }
}
</script>

<style scoped>
.account {
  padding: 20px;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

/* 표 헤더와 열 이름에 대한 스타일 */
th {
  text-align: center; /* 열 이름 가운데 정렬 */
}

/* 표 셀에 대한 스타일 */
td {
  text-align: center; /* 셀 내용 가운데 정렬 */
}
</style>
