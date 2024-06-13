<template>
  <div class="container">
    <h3 class="h3">빠른 거래 추가</h3>
    <!-- 거래 추가 했을 때 새로고침 말고 초기화 메소드 호출 -->
    <form @submit.prevent="submitTransaction" class="quick-add-form">
      <div class="form-group">
        <div class="icon-label-container">
          <font-awesome-icon :icon="['fas', 'money-check-dollar']" />
          <label for="type">&nbsp;분류</label>
        </div>
        <!-- 사용자가 선택하면 저장되는 드롭다운 목록 required: 필수 제출 -->
        <select v-model="type" id="type" required>
          <!-- 목록은 store에 있는 types(지출, 수입) -->
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
        <div class="icon-label-container">
          <font-awesome-icon :icon="['fas', 'calendar-check']" />
          <label for="date">&nbsp;날짜</label>
        </div>
        <input v-model="date" type="date" id="date" required />
      </div>
      <div class="form-group">
        <div class="icon-label-container">
          <font-awesome-icon :icon="['fas', 'list']" />
          <label for="category">&nbsp;카테고리</label>
        </div>
        <select v-model="category" id="category" required class="custom-select">
          <option disabled selected value>-- 선택해주세요 --</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.name">
            {{ cat.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <div class="icon-label-container">
          <font-awesome-icon :icon="['fas', 'wallet']" />
          <label for="paymentMethod">&nbsp;거래수단</label>
        </div>
        <select
          v-model="paymentMethod"
          id="paymentMethod"
          required
          class="custom-select"
        >
          <option disabled selected value>-- 선택해주세요 --</option>
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
        <div class="icon-label-container">
          <font-awesome-icon :icon="['fas', 'sack-dollar']" />
          <label for="amount">&nbsp;금액</label>
        </div>
        <input
          v-model="formattedAmount"
          type="text"
          id="amount"
          required
          placeholder="숫자만 입력하세요."
          @input="formatAmount"
          @blur="addWon"
          @focus="removeWon"
        />
      </div>
      <div class="form-group">
        <div class="icon-label-container">
          <font-awesome-icon :icon="['fas', 'pen-to-square']" />
          <label for="memo">&nbsp;메모</label>
        </div>
        <input v-model="memo" type="text" id="memo" />
      </div>
      <div class="form-group reduced-margin">
        <div class="icon-label-container-period">
          <font-awesome-icon :icon="['fas', 'thumbtack']" />
          <label for="period" class="period-label">&nbsp;고정 지출</label>
        </div>
        <input
          v-model="period"
          type="checkbox"
          id="period"
          class="period-checkbox"
        />
        <!-- </div> -->
      </div>
      <div v-if="period" class="form-group">
        <div class="icon-label-container">
          <font-awesome-icon :icon="['fas', 'arrows-spin']" />

          <label for="duration">&nbsp;주기</label>
        </div>
        <select v-model="duration" id="duration" required class="custom-select">
          <option disabled selected value>-- 선택해주세요 --</option>
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
import { useBudgetStore } from '@/stores/budgetStore'; //store에서 데이터 읽기, 새 데이터 넣기 불러옴

const type = ref('지출'); // 초기 값을 "지출"로 설정
const date = ref(new Date().toISOString().slice(0, 10)); //현재 날짜로 지정, 문자열의 0부터 10번째까지만 출력
const category = ref('');
const paymentMethod = ref('');
const amount = ref(0);
const memo = ref('');
const period = ref(false); //고정 지출이 아닌 상태로 초기화
const duration = ref('');

const formattedAmount = ref('');

const budgetStore = useBudgetStore();
const categories = ref([]); //categories를 담을 반응형 그릇 준비

// 초기화 시 "지출" 카테고리를 설정
onMounted(async () => {
  await budgetStore.fetchTypes(); //타입 목록 불러올 때 까지 대기
  await budgetStore.fetchIncomeCategories(); //지출 목록 불러올 때까지 대기
  await budgetStore.fetchExpenseCategories(); //수입 목록 불러올 때까지 대기
  await budgetStore.fetchPaymentMethods(); //거래방식 목록 불러올 때까지 대기
  console.log('Income categories:', budgetStore.incomeCategories); // 대기 후 디버깅용 로그 추가(무시)
  console.log('Expense categories:', budgetStore.expenseCategories); // 대기 후 디버깅용 로그 추가(무시)

  updateCategories(type.value); //value가 지출이냐 수입이냐에 따라 목록 올리기
});

// type 값을 지켜보고 있다가 바뀌면(ex. 수입 -> 지출) 목록 바꾸는 함수 호출
watch(type, (newValue) => {
  console.log('Type changed to:', newValue); // 디버깅용 로그 추가
  updateCategories(newValue);
});

const updateCategories = (newType) => {
  console.log('Updating categories for type:', newType); // 디버깅용 로그 추가(무시)
  if (newType === '수입') {
    categories.value = budgetStore.incomeCategories; //수입이 적용되면 수입 목록으로 바꾸기
    console.log('Income categories set:', categories.value); // 디버깅용 로그 추가(무시)
  } else if (newType === '지출') {
    categories.value = budgetStore.expenseCategories; //지출이 적용되면 지출 목록으로 바꾸기
    console.log('Expense categories set:', categories.value); // 디버깅용 로그 추가(무시)
  } else {
    categories.value = []; //둘 다 아닐시에 빈 배열로 두기(예외처리)
  }
};

// 금액 쳤을 때 숫자 외 다른 자료형 못 들어오게 막기
const formatAmount = (event) => {
  const input = event.target.value.replace(/[^0-9]/g, ''); //해당 값이 숫자가 아니면 빈칸으로 교체
  const numberValue = parseInt(input, 10); //10진수로 교체(우리에게 친숙한 숫자)

  // 금액 형태 자동 변환 (ex. 100,000)
  if (isNaN(numberValue)) {
    formattedAmount.value = '';
    amount.value = 0; //숫자 아니면 금액 빈칸 처리
  } else {
    formattedAmount.value = numberValue.toLocaleString('ko-KR');
    amount.value = numberValue; //숫자가 들어왔다면 콤마 있는 형태로 변환
  }
};

//숫자형 뒤에 '원' 붙이기
const addWon = () => {
  if (formattedAmount.value) {
    formattedAmount.value += ' 원';
  }
};

//붙어 있는 '원' 지우기
const removeWon = () => {
  formattedAmount.value = formattedAmount.value.replace(' 원', '');
};

const submitTransaction = async () => {
  //콜백함수 선언
  const transaction = {
    //'거래'에 빠른 거래 추가에 있는 요소들 넣어줌
    type: type.value,
    date: date.value,
    category: category.value,
    paymentMethod: paymentMethod.value,
    amount: amount.value,
    memo: memo.value,
    duration: period.value ? duration.value : null, //고정지출 체크될 시에만 나옴
    period: period.value,
  };

  try {
    await budgetStore.addBudget(transaction); //db에 새로운 거래 목록 넣을 때까지 기다려
    type.value = '지출'; // 초기화
    date.value = new Date().toISOString().slice(0, 10);
    category.value = '';
    paymentMethod.value = '';
    amount.value = 0;
    memo.value = '';
    period.value = false;
    duration.value = '';
    formattedAmount.value = '';
    alert('거래가 성공적으로 추가되었습니다.');
    updateCategories(type.value); // 카테고리 재설정 (태초마을)
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
  margin-top: 50px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 85%;
  border: 1px solid lightgray;
  border-radius: 60px;
  box-shadow: 0 7px 20px rgba(0, 0, 0, 0.1);
}

.h3 {
  text-align: center;
  color: gray;
  margin-bottom: 15px;
}

.quick-add-form {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
  overflow-x: auto;
  max-width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px;
}

.reduced-margin {
  padding: 0 2px; /* 고정 지출 항목의 좌우 여백을 줄이기 */
  margin: 0 2px; /* 고정 지출 항목의 좌우 여백을 줄이기 */
}

.icon-label-container {
  display: flex;
  align-items: center;
  gap: 5px; /* 아이콘과 텍스트 사이의 간격 */
}

.icon-label-container-period {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 15px;
}

.period-checkbox {
  height: 15px;
  margin-top: -5px;
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

.custom-select option[value=''][disabled] {
  color: lightgray;
}
</style>
