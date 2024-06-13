<template>
  <div id="app">
    <header>
      <h1><b>KB-ACCOUNTBOOK-VUE3</b></h1>
      <nav>
        <router-link to="/" :class="{ 'active-link': $route.path === '/' }">Home</router-link>
        <router-link to="/statistic" :class="{ 'active-link': $route.path === '/statistic' }">Statistics</router-link>
        <router-link to="/profile" :class="{ 'active-link': $route.path === '/profile' }">Profile</router-link>
        <router-link to="/account" :class="{ 'active-link': $route.path === '/account' }">Account</router-link>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
    <footer>
      <p>&copy; 2024 My Financial Dashboard</p>
    </footer>
  </div>
</template>

<style scoped>
@import 'bootstrap/dist/css/bootstrap.min.css';
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&family=Orbit&display=swap');

* {
  font-family: 'Noto Sans KR', sans-serif;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333333;
}

header {
  background-color: #2dce89;
  padding: 20px;
  color: white;
}

header h1 {
  margin: 0;
}

nav {
  margin-top: 10px;
}

nav a {
  margin: 0 15px;
  color: white;
  text-decoration: none;
}

nav a:hover {
  text-decoration: underline;
}

/* 열려있는 페이지 표시하는 박스*/
nav a.active-link {
  background-color: #ffffff;
  color: #2dce89;
}

main {
  padding: 20px;
}

footer {
  background-color: #2dce89;
  color: white;
  padding: 10px;
  /* position: fixed; */
  width: 100%;
  bottom: 0;
}
</style>
