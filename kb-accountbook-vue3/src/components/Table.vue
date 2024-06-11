<template>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>날짜</th>
            <th>분류</th>
            <th>카테고리</th>
            <th>금액</th>
            <th>메모</th>
          </tr>
        </thead>ㅎ
        <tbody>
          <tr v-for="item in budget" :key="item.id">
            <td>{{ item.date }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.category }}</td>
            <td>{{ item.amount }}</td>
            <td>{{ item.memo }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        budget: []
      };
    },
    created() {
      this.fetchData();
    },
    methods: {
      async fetchData() {
        try {
          const response = await axios.get('http://localhost:3000/budget');
          this.budget = response.data;
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .table-container {
    display: flex;
    justify-content: center; /* 가로 방향 가운데 정렬 */
    align-items: center;    /* 세로 방향 가운데 정렬 */
    height: 100vh;          /* 전체 화면 높이 */
  }
  
  table {
    width: 80%;             /* 테이블 너비를 적절히 설정 */
    border-collapse: collapse;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;     /* 표 안의 모든 내용 가운데 정렬 */
  }
  
  th {
    background-color: #f2f2f2;
  }
  </style>
  