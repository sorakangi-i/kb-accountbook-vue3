<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">Home</router-link>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup></script>

<style>
@import 'bootstrap/dist/css/bootstrap.min.css';
</style>