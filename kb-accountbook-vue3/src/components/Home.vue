<template>
  <div>
    <h1>Home Page</h1>
    <p>Count: {{ counter.count }}</p>
    <button @click="counter.increment">Increment</button>
    <button @click="counter.decrement">Decrement</button>
  </div>
</template>

<script>
import { useCounterStore } from '../stores/counter'

export default {
  name: 'Home',
  setup() {
    const counter = useCounterStore()
    return { counter }
  }
}
</script>

<style scoped>
/* 스타일 정의 */
</style>
