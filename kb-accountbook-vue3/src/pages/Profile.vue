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

      <!-- Budget Settings Component -->
      <h2>목표 금액 설정</h2>
      <BudgetSettings :budgets="budgets" />

      <button type="submit" class="submit">작성 완료</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import BudgetSettings from '../components/BudgetSettings.vue';

export default {
  components: {
    BudgetSettings,
  },
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
      budgets: [
        { category: '용돈', amount: 10000 },
        { category: '온라인쇼핑', amount: 50000 },
      ],
    };
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
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.profilePictureUrl = URL.createObjectURL(file);
      }
    },
    formatNumber(value) {
      if (typeof value !== 'number') {
        value = parseInt(value.replace(/,/g, ''));
      }
      return isNaN(value) ? '' : value.toLocaleString();
    },
    async submitProfile() {
      try {
        const memberResponse = await axios.put(
          'http://localhost:3000/member/1',
          {
            name: this.member.name,
            gender: this.member.gender,
            birth: `${this.birthYear}년 ${String(this.birthMonth).padStart(
              2,
              '0'
            )}월 ${String(this.birthDay).padStart(2, '0')}일`,
            mobile: this.member.mobile,
            email: this.member.email,
          }
        );

        const existingSavingsResponse = await axios.get(
          'http://localhost:3000/saving'
        );
        const existingSavings = existingSavingsResponse.data;

        const budgetsToSave = this.budgets.map((budget) => {
          const existingSaving = existingSavings.find(
            (s) => s.category === budget.category
          );
          return {
            categoryAllowance: `${this.formatNumber(budget.amount)}원`,
            category: budget.category,
            id: existingSaving
              ? existingSaving.id
              : Math.random().toString(36).substring(2, 10),
          };
        });

        const budgetsResponse = await Promise.all(
          budgetsToSave.map((budget) => {
            const existingSaving = existingSavings.find(
              (s) => s.category === budget.category
            );
            if (existingSaving) {
              return axios.put(
                `http://localhost:3000/saving/${existingSaving.id}`,
                budget
              );
            } else {
              return axios.post(
                'http://localhost:3000/saving',
                budget
              );
            }
          })
        );

        if (
          memberResponse.status === 200 &&
          budgetsResponse.every(
            (res) => res.status === 200 || res.status === 201
          )
        ) {
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
</style>
