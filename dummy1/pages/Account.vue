<template>
  <div class="account">
    <h1>Account Information</h1>
    <Table />
  </div>
</template>

<script>
import Table from './components/Table.vue';

export default {
  components: {
    Table
  }
}
</script>

<style scoped>
.account {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* 전체 화면 높이 */
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}
</style>
