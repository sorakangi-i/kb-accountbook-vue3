<template>
  <div id="app">
    <header>
      <h1>소비어트</h1>
      <nav>
        <router-link to="/"
          ><i class="fa-solid fa-house"></i>&nbsp; Home</router-link
        >
        <router-link to="/statistic"
          ><i class="fa-solid fa-chart-pie"></i>&nbsp; Statistics</router-link
        >
        <router-link to="/account"
          ><i class="fa-solid fa-receipt"></i>&nbsp; Account</router-link
        >
        <router-link to="/profile"
          ><i class="fa-solid fa-user"></i>&nbsp; Profile</router-link
        >
      </nav>
    </header>
    <main>
      <router-view />
    </main>
    <footer>
      <p>&copy; 2024 made by 오조의 마법사들</p>
    </footer>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&family=Orbit&display=swap');

* {
  font-family: 'Noto Sans KR', sans-serif;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

header {
  background-color: #35495e;
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

main {
  padding: 20px;
}

footer {
  background-color: #35495e;
  color: white;
  padding: 10px;
  position: fixed;
  width: 100%;
  bottom: 0;
}
</style>
