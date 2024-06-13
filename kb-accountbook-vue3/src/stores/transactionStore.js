import { defineStore } from 'pinia';
import axios from 'axios';

//달력에서 클릭한 날짜(date) & 해당 날짜의 거래 내역 데이터(transaction)
export const useTransactionStore = defineStore('transactionStore', {
  state: () => ({
    selectedDate: '',
    selectedTransactions: [],
  }),
  actions: {
    setSelectedDate(date) {
      this.selectedDate = date;
    },
    setSelectedTransactions(transactions) {
      this.selectedTransactions = transactions;
    },
  },
});

// example)
// selectedDate: 2024-06-12
// selectedTransactions:  [
//     {
//         "id": "test01",
//         "date": "2024-06-10",
//         "type": "지출",
//         "category": "용돈",
//         "amount": 10000,
//         "memo": "부모님 용돈",
//         "period": true,
//         "duration": "weekly"
//       },
//       {
//         "id": "aa92",
//         "type": "지출",
//         "date": "2024-06-10",
//         "category": "온라인쇼핑",
//         "paymentMethod": "현금",
//         "amount": 50000,
//         "memo": "옷",
//         "duration": null,
//         "period": false
//       }]
