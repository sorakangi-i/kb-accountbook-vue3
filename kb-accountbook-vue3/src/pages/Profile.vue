<template>
  <div class="profile-page container">
    <h1>프로필</h1>
    <form @submit.prevent="submitProfile">
      <!-- Member Information -->
      <div class="form-row">
        <span class="th">
          <font-awesome-icon icon="image" class="fa_icon" />
          <label for="profilePicture">프로필 사진</label>
        </span>
        <span class="td">
          <img
            v-if="profilePictureUrl"
            :src="profilePictureUrl"
            alt="Profile Picture"
            class="profile-picture-preview"
          />
          <input type="file" id="profilePicture" @change="onFileChange" />
        </span>
      </div>

      <div class="form-row">
        <span class="th">
          <font-awesome-icon icon="heart" class="fa_icon" />
          <label for="name">이름</label>
        </span>
        <span class="td">
          <input
            type="text"
            id="name"
            v-model="member.name"
            @keypress="validateName"
            placeholder="이름을 입력하세요"
          />
        </span>
      </div>

      <div class="form-row">
        <span class="th">
          <font-awesome-icon icon="user" class="fa_icon" />
          <label>성별</label>
        </span>
        <span class="td radio-group">
          <input type="radio" id="male" value="남성" v-model="member.gender" />
          <label for="male">남성</label>
          <br />
          <input
            type="radio"
            id="female"
            value="여성"
            v-model="member.gender"
          />
          <label for="female">여성</label>
        </span>
      </div>

      <div class="form-row">
        <span class="th">
          <font-awesome-icon icon="cake-candles" class="fa_icon" />
          <label>생년월일</label>
        </span>
        <span class="td">
          <select v-model="birthYear" class="birth-select">
            <option value="" disabled selected>년</option>
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
          년
          <select v-model="birthMonth" class="birth-select">
            <option value="" disabled selected>월</option>
            <option v-for="month in months" :key="month" :value="month">
              {{ month }}
            </option>
          </select>
          월
          <select v-model="birthDay" class="birth-select">
            <option value="" disabled selected>일</option>
            <option v-for="day in days" :key="day" :value="day">
              {{ day }}
            </option>
          </select>
          일
        </span>
      </div>

      <div class="form-row">
        <span class="th">
          <font-awesome-icon icon="mobile-screen" class="fa_icon" />
          <label for="mobile">전화번호</label>
        </span>
        <span class="td">
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
        </span>
      </div>

      <div class="form-row">
        <span class="th">
          <font-awesome-icon icon="envelope" class="fa_icon" />
          <label>이메일 주소</label>
        </span>
        <span class="td">
          <input
            type="text"
            v-model="emailId"
            class="email-input"
            placeholder="이메일 입력"
          />
          @
          <select v-model="emailDomain" class="email-select">
            <option value="gmail.com">gmail.com</option>
            <option value="naver.com">naver.com</option>
            <option value="daum.net">daum.net</option>
          </select>
        </span>
      </div>

      <!-- Budget Information -->
      <div>
        <h2>목표 금액 설정</h2>
        <div class="form-row">
          <span class="th">
            <font-awesome-icon icon="coins" class="fa_icon" />
            <label for="selectedCategory">카테고리</label>
          </span>
          <span class="td">
            <select
              id="selectedCategory"
              v-model="selectedCategory"
              class="category-select"
            >
              <option value="" disabled selected>- 선택해주세요</option>
              <option
                v-for="category in availableCategories"
                :key="category.id"
                :value="category.name"
              >
                {{ category.name }}
              </option>
            </select>
            <button type="button" @click="toggleNewCategoryInput">
              {{ showNewCategoryInput ? '추가 취소' : '추가' }}
            </button>
          </span>
        </div>
        <div v-if="showNewCategoryInput" class="form-row">
          <span class="th">
            <font-awesome-icon icon="plus" class="fa_icon" />
            <label for="newCategory">카테고리 추가</label>
          </span>
          <span class="td">
            <input
              type="text"
              id="newCategory"
              v-model="newCategory"
              placeholder="새 카테고리 입력"
            />
            <button type="button" @click="confirmAddCategory">확인</button>
            <button type="button" @click="cancelAddCategory" class="cancel">
              취소
            </button>
          </span>
        </div>

        <div v-for="(budget, index) in budgets" :key="index" class="form-row">
          <span class="th">
            <label>
              <font-awesome-icon icon="bullseye" class="fa_icon" />
              <span class="color">{{ budget.category }}</span>
              <br />
              목표 설정
            </label>
          </span>

          <span class="td">
            <input
              type="text"
              v-model="budget.amount"
              @input="formatBudgetAmount(index)"
            />
            원
            <button type="button" @click="removeBudget(index)">삭제</button>
          </span>
        </div>
      </div>

      <button type="submit" class="submit">작성 완료</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      member: {
        name: '김재이',
        gender: '여성',
        birth: '1998-04-17',
        mobile: '010-2709-7767',
        email: 'ksy980417@gmail.com',
      },
      phonePart1: '010',
      phonePart2: '2709',
      phonePart3: '7767',
      emailId: 'ksy980417',
      emailDomain: 'gmail.com',
      birthYear: 1998,
      birthMonth: 4,
      birthDay: 17,
      profilePictureUrl: null,
      years: Array.from(
        { length: 101 },
        (v, k) => new Date().getFullYear() - k
      ), // 최근 100년
      months: Array.from({ length: 12 }, (v, k) => k + 1),
      days: Array.from({ length: 31 }, (v, k) => k + 1),
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
      budgets: [
        { category: '용돈', amount: 10000 },
        { category: '온라인쇼핑', amount: 50000 },
      ],
      selectedCategory: '',
      targetBudget: 0,
      showNewCategoryInput: false,
      newCategory: '',
    };
  },
  computed: {
    availableCategories() {
      const selectedCategories = this.budgets.map((budget) => budget.category);
      return this.expenseCategories.filter(
        (category) => !selectedCategories.includes(category.name)
      );
    },
  },
  watch: {
    birthYear() {
      this.updateBirth();
    },
    birthMonth() {
      this.updateBirth();
    },
    birthDay() {
      this.updateBirth();
    },
    emailId() {
      this.updateEmail();
    },
    emailDomain() {
      this.updateEmail();
    },
    phonePart1() {
      this.updateMobile();
    },
    phonePart2() {
      this.updateMobile();
    },
    phonePart3() {
      this.updateMobile();
    },
    selectedCategory(newCategory) {
      if (newCategory) {
        if (!this.budgets.some((budget) => budget.category === newCategory)) {
          this.budgets.push({ category: newCategory, amount: 0 });
        }
        this.selectedCategory = '';
      }
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
        this.member.birth = `${this.birthYear}년 ${String(
          this.birthMonth
        ).padStart(2, '0')}월 ${String(this.birthDay).padStart(2, '0')}일`;
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
    formatBudgetAmount(index) {
      this.budgets[index].amount = this.parseNumber(this.budgets[index].amount);
      this.budgets[index].amount = this.formatNumber(
        this.budgets[index].amount
      );
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.profilePictureUrl = URL.createObjectURL(file);
      }
    },
    toggleNewCategoryInput() {
      this.showNewCategoryInput = !this.showNewCategoryInput;
    },
    confirmAddCategory() {
      const newId = (this.expenseCategories.length + 1).toString();
      this.expenseCategories.push({ id: newId, name: this.newCategory });
      this.newCategory = '';
      this.showNewCategoryInput = false;
    },
    cancelAddCategory() {
      this.newCategory = '';
      this.showNewCategoryInput = false;
    },
    removeBudget(index) {
      this.budgets.splice(index, 1);
    },
    async submitProfile() {
      try {
        const memberResponse = await axios.put('YOUR_API_ENDPOINT/member/1', {
          name: this.member.name,
          gender: this.member.gender,
          birth: `${this.birthYear}년 ${String(this.birthMonth).padStart(
            2,
            '0'
          )}월 ${String(this.birthDay).padStart(2, '0')}일`,
          mobile: this.member.mobile,
          email: this.member.email,
        });

        const budgetsToSave = this.budgets.map((budget) => ({
          categoryAllowance: `${this.formatNumber(budget.amount)}원`,
          category: budget.category,
          id: Math.random().toString(36).substring(2, 10), // 임의의 ID 생성
        }));

        const budgetsResponse = await axios.put(
          'YOUR_API_ENDPOINT/saving',
          budgetsToSave
        );

        if (memberResponse.status === 200 && budgetsResponse.status === 200) {
          alert('제출 완료');
          console.log('Profile submitted', this.member);
          console.log('Budgets submitted', budgetsToSave);
        } else {
          alert('제출 실패');
        }
      } catch (error) {
        alert('제출 중 오류 발생');
        console.error('Error submitting profile:', error);
      }
    },
  },
};
</script>

<style scoped>
.profile-page {
  max-width: 600px;
  margin: 0 auto;
  margin-bottom: 3.5rem;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 6px;
}

.profile-page h1,
.profile-page h2 {
  margin-top: 35px;
  margin-bottom: 15px;
  text-align: center;
  letter-spacing: -1.5px;
  font-size: 1.7rem;
  font-weight: 600;
}

.profile-page form label {
  font-weight: 600;
  color: #353535;
  letter-spacing: -0.8px;
  margin-bottom: 5px;
}

.profile-page form .form-row {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.profile-page form .th {
  flex-basis: 30%;
  display: flex;
  align-items: center;
  text-align: left;
}

.profile-page form .th label .color {
  color: #793ff3;
}

.profile-page form .td {
  flex-basis: 70%;
  display: flex;
  align-items: center;
}

.fa_icon {
  margin-right: 8px;
}

.profile-picture-preview {
  display: block;
  margin-top: 10px;
  max-height: 150px;
  border-radius: 10px;
  border: 1px solid #eee;
}

.profile-page form input,
.profile-page form select,
.profile-page form textarea {
  flex-basis: content;
  width: 100%;
  margin: 10px 0;
  padding: 8px 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #eee;
  background-color: #fcfcfc;
  cursor: pointer;
}

.profile-page form input[type='radio'] {
  display: none;
}

.profile-page form .radio-group label {
  display: inline-block;
  margin-right: 15px;
  cursor: pointer;
}
.profile-page form .radio-group label:hover {
  color: #793ff3;
}

.profile-page form .radio-group input[type='radio'] + label::before {
  content: '';
  display: inline-block;
  width: 25px;
  height: 25px;
  border: 2px solid #a7a7a7;
  background-color: #fcfcfc;
  border-radius: 50%;
  margin-right: 5px;
  vertical-align: middle;
}

.profile-page form .radio-group input[type='radio']:checked + label {
  color: #793ff3;
}
.profile-page form .radio-group input[type='radio']:checked + label::before {
  transition: border 0.3s ease-in-out;
  background-color: #ffffff;
  border: 7px solid #793ff3;
}

.profile-page form select {
  width: auto;
}

.profile-page form .birth-select {
  width: auto;
}
.profile-page form .email-input {
  flex-basis: content;
}
.profile-page form .email-select {
  width: auto;
}

.profile-page form .category-select {
  width: 100%;
}

.profile-page form button {
  margin-left: 5px;
  min-width: 80px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 6px;
  border: none;
  background-color: #7840f2;
  color: white;
  cursor: pointer;
}

.profile-page form button:hover {
  background-color: #571bda;
  transition: 0.3s ease-in-out;
}

.profile-page form .submit {
  margin-top: 25px;
  margin-bottom: 10px;
  min-width: 200px;
  font-size: 18px;
}
.profile-page form .cancel {
  color: #353535;
  background-color: #e5dbff;
}
.profile-page form .cancel:hover {
  color: #353535;
  background-color: #c9b7f7;
}
</style>
