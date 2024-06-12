<template>
  <div class="circular-progress-bar">
    <svg class="circular-chart" viewBox="0 0 50 50">
      <path
        class="circle-bg"
        d="M25 2.5
        a 22.5 22.5 0 0 1 0 45
        a 22.5 22.5 0 0 1 0 -45"
      />
      <path
        class="circle"
        :stroke-dasharray="progressPath"
        d="M25 2.5
        a 22.5 22.5 0 0 1 0 45
        a 22.5 22.5 0 0 1 0 -45"
      />
      <text x="25" y="27.5" class="percentage">{{ percentage }}%</text>
    </svg>
    <div class="details">{{ details }} 원</div>
    <div class="risk">Risk: {{ risk }}</div>
  </div>
</template>

<script>
export default {
  name: 'CircularProgressBar',
  props: {
    percentage: {
      type: Number,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    risk: {
      type: String,
      required: true,
    },
  },
  computed: {
    progressPath() {
      const circumference = 141.3; // Circumference of the circle (2 * π * radius)
      const progress = (this.percentage / 100) * circumference;
      return `${progress} ${circumference}`;
    },
  },
};
</script>

<style scoped>
.circular-progress-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 150px;
  margin: 0 auto;
}

.circular-chart {
  display: block;
  margin: 10px auto;
  max-width: 100%;
  max-height: 150px;
}

.circle-bg {
  fill: none;
  stroke: #eee;
  stroke-width: 3.8;
}

.circle {
  fill: none;
  stroke-width: 2.8;
  stroke: #4caf50;
  stroke-linecap: round;
  animation: progress 1s ease-out forwards;
}

.percentage {
  fill: #666;
  font-size: 0.7em;
  text-anchor: middle;
}

.details {
  margin-top: 10px;
  font-size: 0.85em;
}

.risk {
  margin-top: 5px;
  font-size: 0.85em;
}

@keyframes progress {
  0% {
    stroke-dasharray: 0 141.3;
  }
}
</style>
