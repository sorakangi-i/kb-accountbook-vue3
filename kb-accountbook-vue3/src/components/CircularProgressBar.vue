<template>
  <!-- 원형 프로그레스 바 컴포넌트 템플릿  잘 모르겠다...-->
  <div class="circular-progress-bar">
    <!-- SVG를 이용한 원형 차트 -->
    <svg class="circular-chart" viewBox="0 0 50 50">
      <!-- 배경 원형 경로 -->
      <path
        class="circle-bg"
        d="M25 2.5
        a 22.5 22.5 0 0 1 0 45
        a 22.5 22.5 0 0 1 0 -45"
      />
      <!-- 진행 중인 원형 경로 -->
      <path
        class="circle"
        :stroke-dasharray="progressPath"
        d="M25 2.5
        a 22.5 22.5 0 0 1 0 45
        a 22.5 22.5 0 0 1 0 -45"
      />
      <!-- 백분율 텍스트 -->
      <text x="25" y="27.5" class="percentage">{{ percentage }}%</text>
    </svg>
    <!-- 세부 정보 -->
    <div class="details">{{ details }} 원</div>
    <!-- 위험 수준 -->
    <div class="risk">Risk: {{ risk }}</div>
  </div>
</template>

<script>
export default {
  name: 'CircularProgressBar', // 컴포넌트 이름
  props: {
    percentage: {
      // 백분율 프로퍼티
      type: Number,
      required: true,
    },
    details: {
      // 세부 정보 프로퍼티
      type: String,
      required: true,
    },
    risk: {
      // 위험 수준 프로퍼티
      type: String,
      required: true,
    },
  },
  computed: {
    progressPath() {
      // 진행 경로 계산
      const circumference = 141.3; // 원의 둘레 (2 * π * 반지름)
      const progress = (this.percentage / 100) * circumference; // 진행 정도 계산
      return `${progress} ${circumference}`; // 진행 경로 반환
    },
  },
};
</script>

<style scoped>
/* 컴포넌트 내부 스타일 */

/* 원형 프로그레스 바 컨테이너 스타일 */
.circular-progress-bar {
  display: flex; /* 플렉스 레이아웃 사용 */
  flex-direction: column; /* 수직 방향으로 요소 배치 */
  align-items: center; /* 아이템 가운데 정렬 */
  justify-content: center; /* 콘텐츠 중앙 정렬 */
  width: 150px; /* 너비 설정 */
  margin: 0 auto; /* 가운데 정렬 */
}

/* SVG 원형 차트 스타일 */
.circular-chart {
  display: block; /* 블록 요소로 설정 */
  margin: 10px auto; /* 마진 설정 */
  max-width: 100%; /* 최대 너비 지정 */
  max-height: 150px; /* 최대 높이 지정 */
}

/* 배경 원형 스타일 */
.circle-bg {
  fill: none; /* 채우기 제거 */
  stroke: #eee; /* 테두리 색상 */
  stroke-width: 3.8; /* 테두리 너비 */
}

/* 진행 중인 원형 스타일 */
.circle {
  fill: none; /* 채우기 제거 */
  stroke-width: 2.8; /* 테두리 너비 */
  stroke: #4caf50; /* 테두리 색상 */
  stroke-linecap: round; /* 테두리 라인 스타일 */
  animation: progress 1s ease-out forwards; /* 애니메이션 효과 */
}

/* 백분율 텍스트 스타일 */
.percentage {
  fill: #666; /* 글꼴 색상 */
  font-size: 0.7em; /* 글꼴 크기 */
  text-anchor: middle; /* 텍스트 정렬 */
}

/* 세부 정보 스타일 */
.details {
  margin-top: 10px; /* 상단 여백 설정 */
  font-size: 0.85em; /* 글꼴 크기 */
}

/* 위험 수준 스타일 */
.risk {
  margin-top: 5px; /* 상단 여백 설정 */
  font-size: 0.85em; /* 글꼴 크기 */
}

/* 진행 애니메이션 키 프레임 */
@keyframes progress {
  0% {
    stroke-dasharray: 0 141.3; /* 시작 시 진행도 없음 */
  }
}
</style>
