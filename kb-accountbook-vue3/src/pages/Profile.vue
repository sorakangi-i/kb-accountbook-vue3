<template>
  <div class="profile-page">
    <h1>프로필</h1>
    <form @submit.prevent="submitProfile">
      <!-- Member Information -->
      <div>
        <label for="profilePicture">프로필 사진:</label>
        <input type="file" id="profilePicture" @change="onFileChange" />
        <img
          v-if="profilePictureUrl"
          :src="profilePictureUrl"
          alt="Profile Picture"
          class="profile-picture-preview"
        />
      </div>

      <div>
        <label for="id">아이디:</label>
        <input type="text" id="id" v-model="member.id" />
      </div>

      <div>
        <label for="password">비밀번호:</label>
        <input type="password" id="password" v-model="member.password" />
      </div>

      <div>
        <label for="name">이름:</label>
        <input
          type="text"
          id="name"
          v-model="member.name"
          @keypress="validateName"
        />
      </div>

      <div>
        <label>성별:</label>
        <input type="radio" id="male" value="male" v-model="member.gender" />
        <label for="male">남성</label>
        <input
          type="radio"
          id="female"
          value="female"
          v-model="member.gender"
        />
        <label for="female">여성</label>
        <input type="radio" id="other" value="other" v-model="member.gender" />
        <label for="other">기타</label>
      </div>

      <div>
        <label>생년월일:</label>
        <select v-model="birthYear">
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
        년
        <select v-model="birthMonth">
          <option v-for="month in months" :key="month" :value="month">
            {{ month }}
          </option>
        </select>
        월
        <select v-model="birthDay">
          <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
        </select>
        일
      </div>

      <div>
        <label for="mobile">전화번호:</label>
        <div>
          <input
            type="tel"
            v-model="phonePart1"
            maxlength="3"
            style="width: 50px; display: inline-block"
          />
          -
          <input
            type="tel"
            v-model="phonePart2"
            maxlength="4"
            style="width: 70px; display: inline-block"
          />
          -
          <input
            type="tel"
            v-model="phonePart3"
            maxlength="4"
            style="width: 70px; display: inline-block"
          />
        </div>
      </div>

      <div>
        <label>이메일 주소:</label>
        <input type="text" v-model="emailId" />
        @
        <select v-model="emailDomain">
          <option value="gmail.com">gmail.com</option>
          <option value="naver.com">naver.com</option>
          <option value="daum.net">daum.net</option>
        </select>
      </div>

      <!-- Income Information -->
      <div>
        <h2>수입 정보</h2>
        <div>
          <label for="fortune">자산:</label>
          <input
            type="text"
            id="fortune"
            v-model="formattedFortune"
            @input="formatFortune"
          />
          원
        </div>
        <div>
          <label for="allowance">용돈:</label>
          <input
            type="text"
            id="allowance"
            v-model="formattedAllowance"
            @input="formatAllowance"
          />
          원
        </div>
        <div>
          <label for="refund">환급:</label>
          <input
            type="text"
            id="refund"
            v-model="formattedRefund"
            @input="formatRefund"
          />
          원
        </div>
        <div>
          <label for="other">기타:</label>
          <input
            type="text"
            id="other"
            v-model="formattedOther"
            @input="formatOther"
          />
          원
        </div>
      </div>

      <!-- Budget Information -->
      <div>
        <h2>목표 금액 설정</h2>
        <div>
          <label for="selectedCategory">카테고리:</label>
          <select id="selectedCategory" v-model="selectedCategory">
            <option
              v-for="category in expenseCategories"
              :key="category.id"
              :value="category.name"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <label for="targetBudget">목표 설정 금액:</label>
          <input
            type="text"
            id="targetBudget"
            v-model="formattedTargetBudget"
            @input="formatTargetBudget"
          />
          원
        </div>
        <div v-if="selectedCategory && formattedTargetBudget">
          카테고리: {{ selectedCategory }}<br />
          목표 예산 금액: {{ formattedTargetBudget }} 원
        </div>
      </div>

      <button type="submit">제출</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      member: {
        id: '',
        password: '',
        name: '',
        gender: '',
        birth: '',
        mobile: '',
        email: '',
      },
      income: {
        fortune: 0,
        allowance: 0,
        refund: 0,
        other: 0,
      },
      budget: {
        targetBudget: 0,
        periodStart: '',
        periodEnd: '',
      },
      selectedCategory: '',
      phonePart1: '',
      phonePart2: '',
      phonePart3: '',
      emailId: '',
      emailDomain: 'gmail.com',
      birthYear: '',
      birthMonth: '',
      birthDay: '',
      profilePictureUrl: null,
      years: Array.from(
        { length: 101 },
        (v, k) => new Date().getFullYear() - k
      ), // 최근 100년
      months: Array.from({ length: 12 }, (v, k) => k + 1),
      days: Array.from({ length: 31 }, (v, k) => k + 1),
      incomeCategories: [
        { id: '1', name: '월급' },
        { id: '2', name: '용돈' },
        { id: '3', name: '환급' },
        { id: '4', name: '기타' },
      ],
      expenseCategories: [
        { id: '1', name: '온라인쇼핑' },
        { id: '2', name: '패션/쇼핑' },
        { id: '3', name: '식비' },
        { id: '4', name: '카페/간식' },
        { id: '5', name: '주거' },
        { id: '6', name: '통신' },
        { id: '7', name: '교통/차량' },
        { id: '8', name: '의료/건강' },
        { id: '9', name: '보험' },
        { id: '10', name: '대출' },
        { id: '11', name: '교육' },
        { id: '12', name: '저축' },
        { id: '13', name: '생활/마트' },
        { id: '14', name: '기타' },
      ],
    };
  },
  computed: {
    categories() {
      return this.expenseCategories;
    },
    formattedFortune: {
      get() {
        return this.formatNumber(this.income.fortune);
      },
      set(value) {
        this.income.fortune = this.parseNumber(value);
      },
    },
    formattedAllowance: {
      get() {
        return this.formatNumber(this.income.allowance);
      },
      set(value) {
        this.income.allowance = this.parseNumber(value);
      },
    },
    formattedRefund: {
      get() {
        return this.formatNumber(this.income.refund);
      },
      set(value) {
        this.income.refund = this.parseNumber(value);
      },
    },
    formattedOther: {
      get() {
        return this.formatNumber(this.income.other);
      },
      set(value) {
        this.income.other = this.parseNumber(value);
      },
    },
    formattedTargetBudget: {
      get() {
        return this.formatNumber(this.budget.targetBudget);
      },
      set(value) {
        this.budget.targetBudget = this.parseNumber(value);
      },
    },
    budgetPeriodDays() {
      if (this.budget.periodStart && this.budget.periodEnd) {
        const startDate = new Date(this.budget.periodStart);
        const endDate = new Date(this.budget.periodEnd);
        const diffTime = Math.abs(endDate - startDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
      return 0;
    },
  },
  watch: {
    birthYear(newYear) {
      this.updateBirth();
    },
    birthMonth(newMonth) {
      this.updateBirth();
    },
    birthDay(newDay) {
      this.updateBirth();
    },
    emailId(newEmailId) {
      this.updateEmail();
    },
    emailDomain(newEmailDomain) {
      this.updateEmail();
    },
    phonePart1(newPart) {
      this.updateMobile();
    },
    phonePart2(newPart) {
      this.updateMobile();
    },
    phonePart3(newPart) {
      this.updateMobile();
    },
  },
  methods: {
    validateName(event) {
      const charCode = event.keyCode ? event.keyCode : event.which;
      if (charCode >= 48 && charCode <= 57) {
        event.preventDefault();
      }
    },
    updateBirth() {
      if (this.birthYear && this.birthMonth && this.birthDay) {
        this.member.birth = `${this.birthYear}-${String(
          this.birthMonth
        ).padStart(2, '0')}-${String(this.birthDay).padStart(2, '0')}`;
      }
    },
    updateEmail() {
      if (this.emailId && this.emailDomain) {
        this.member.email = `${this.emailId}@${this.emailDomain}`;
      }
    },
    updateMobile() {
      if (this.phonePart1 && this.phonePart2 && this.phonePart3) {
        this.member.mobile = `${this.phonePart1}-${this.phonePart2}-${this.phonePart3}`;
      }
    },
    formatNumber(value) {
      if (typeof value !== 'number') {
        value = parseInt(value.replace(/,/g, ''));
      }
      return isNaN(value) ? '' : value.toLocaleString();
    },
    parseNumber(value) {
      return parseInt(value.replace(/,/g, '')) || 0;
    },
    formatFortune(event) {
      this.income.fortune = this.parseNumber(event.target.value);
      event.target.value = this.formatNumber(this.income.fortune);
    },
    formatAllowance(event) {
      this.income.allowance = this.parseNumber(event.target.value);
      event.target.value = this.formatNumber(this.income.allowance);
    },
    formatRefund(event) {
      this.income.refund = this.parseNumber(event.target.value);
      event.target.value = this.formatNumber(this.income.refund);
    },
    formatOther(event) {
      this.income.other = this.parseNumber(event.target.value);
      event.target.value = this.formatNumber(this.income.other);
    },
    formatTargetBudget(event) {
      this.budget.targetBudget = this.parseNumber(event.target.value);
      event.target.value = this.formatNumber(this.budget.targetBudget);
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.profilePictureUrl = URL.createObjectURL(file);
      }
    },
    updateBudgetPeriod() {
      if (this.budget.periodStart && this.budget.periodEnd) {
        const startDate = new Date(this.budget.periodStart);
        const endDate = new Date(this.budget.periodEnd);
        const diffTime = Math.abs(endDate - startDate);
        this.budgetPeriodDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
    },
    submitProfile() {
      alert('제출 완료');
      console.log('Profile submitted', this.member);
      console.log('Income submitted', this.income);
      console.log('Budget submitted', this.budget);
    },
  },
};
</script>

<style scoped>
.profile-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.profile-page h1,
.profile-page h2 {
  text-align: center;
}

.profile-page form {
  display: flex;
  flex-direction: column;
}

.profile-page form div {
  margin-bottom: 15px;
}

.profile-page form label {
  margin-bottom: 5px;
}

.profile-page form input,
.profile-page form select,
.profile-page form textarea {
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.profile-page form button {
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.profile-page form button:hover {
  background-color: #0056b3;
}

.profile-picture-preview {
  display: block;
  margin-top: 10px;
  max-width: 120px;
  max-height: 120px;
}
</style>
