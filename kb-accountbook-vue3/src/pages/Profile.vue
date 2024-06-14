<template>
  <div class="profile-page container">
    <h1>프로필</h1>
    <form @submit.prevent="submitProfile">
      <!-- 프로필 사진 업로드 -->
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
      <!-- 기본 정보 입력 -->
      <div class="form-row">
        <span class="th">
          <font-awesome-icon icon="heart" class="fa_icon" />
          <label for="name">이름</label>
        </span>
        <span class="td">
          <input
            type="text"
            id="name"
            v-model="profileStore.member.name"
            @keypress="validateName"
            placeholder="이름을 입력하세요"
            autocomplete="off"
          />
        </span>
      </div>
      <div class="form-row">
        <span class="th">
          <font-awesome-icon icon="user" class="fa_icon" />
          <label>성별</label>
        </span>
        <span class="td radio-group">
          <input
            type="radio"
            id="male"
            value="남성"
            v-model="profileStore.member.gender"
          />
          <label for="male">남성</label>
          <input
            type="radio"
            id="female"
            value="여성"
            v-model="profileStore.member.gender"
          />
          <label for="female">여성</label>
        </span>
      </div>
      <!-- 생년월일 선택 -->
      <div class="form-row">
        <span class="th">
          <font-awesome-icon icon="cake-candles" class="fa_icon" />
          <label>생년월일</label>
        </span>
        <span class="td">
          <select v-model="profileStore.member.birthYear" class="birth-select">
            <option value="" disabled>년</option>
            <option
              v-for="year in profileStore.years"
              :key="year"
              :value="year"
            >
              {{ year }}
            </option>
          </select>
          년
          <select v-model="profileStore.member.birthMonth" class="birth-select">
            <option value="" disabled>월</option>
            <option
              v-for="month in profileStore.months"
              :key="month"
              :value="month"
            >
              {{ month }}
            </option>
          </select>
          월
          <select v-model="profileStore.member.birthDay" class="birth-select">
            <option value="" disabled>일</option>
            <option v-for="day in profileStore.days" :key="day" :value="day">
              {{ day }}
            </option>
          </select>
          일
        </span>
      </div>
      <!-- 전화번호 입력 -->
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
            autocomplete="off"
          />
          -
          <input
            type="tel"
            v-model="phonePart2"
            maxlength="4"
            style="width: 70px; display: inline-block"
            autocomplete="off"
          />
          -
          <input
            type="tel"
            v-model="phonePart3"
            maxlength="4"
            style="width: 70px; display: inline-block"
            autocomplete="off"
          />
        </span>
      </div>
      <!-- 이메일 주소 입력 -->
      <div class="form-row">
        <span class="th">
          <font-awesome-icon icon="envelope" class="fa_icon" />
          <label>이메일 주소</label>
        </span>
        <span class="td">
          <input
            type="text"
            v-model="profileStore.member.email"
            class="email-input"
            placeholder="이메일 입력"
            autocomplete="off"
          />
          @
          <select v-model="emailDomain" class="email-domain-select">
            <option value="" disabled selected>선택하세요</option>
            <option
              v-for="domain in emailDomains"
              :key="domain"
              :value="domain"
            >
              {{ domain }}
            </option>
          </select>
        </span>
      </div>
      <!-- 목표 금액 설정 -->
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
              @change="addNewBudget"
            >
              <option value="" disabled selected>- 선택해주세요 -</option>
              <option
                v-for="category in filteredCategories"
                :key="category.id"
                :value="category.name"
              >
                {{ category.name }}
              </option>
            </select>
            <button type="button" @click="toggleNewCategoryInput">
              {{ showNewCategoryInput ? '추가 취소' : '추가' }}
            </button>
            <button type="button" @click="toggleDeleteCategoryInput">
              {{ showDeleteCategoryInput ? '삭제 취소' : '삭제' }}
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
            <button
              type="button"
              @click="confirmAddCategory('expense', newCategory)"
            >
              확인
            </button>
            <button
              type="button"
              @click="toggleNewCategoryInput"
              class="cancel"
            >
              취소
            </button>
          </span>
        </div>
        <div v-if="showDeleteCategoryInput" class="form-row">
          <span class="th">
            <font-awesome-icon icon="minus" class="fa_icon" />
            <label for="deleteCategory">카테고리 삭제</label>
          </span>
          <span class="td">
            <input
              type="text"
              id="deleteCategory"
              v-model="deleteCategory"
              placeholder="삭제할 카테고리 입력"
            />
            <button
              type="button"
              @click="confirmDeleteCategory('expense', deleteCategory)"
            >
              삭제
            </button>
            <button
              type="button"
              @click="toggleDeleteCategoryInput"
              class="cancel"
            >
              취소
            </button>
          </span>
        </div>
        <!-- 설정된 예산 항목 -->
        <div
          v-for="(saving, index) in profileStore.savings"
          :key="saving.id"
          class="form-row"
        >
          <span class="th">
            <label>
              <font-awesome-icon icon="bullseye" class="fa_icon color" />
              <span class="color">{{ saving.category }}</span>
              <br />
              목표 설정
            </label>
          </span>
          <span class="td">
            <input
              type="text"
              v-model="saving.categoryAllowance"
              placeholder="0"
              style="text-align: right"
            />
            원
            <button type="button" @click="removeSingleBudget(index)">
              삭제
            </button>
          </span>
        </div>
      </div>
      <button type="submit" class="submit">작성 완료</button>
    </form>
  </div>
</template>

<script src="./Profile.js"></script>
