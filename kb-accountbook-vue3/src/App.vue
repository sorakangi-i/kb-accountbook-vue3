<template>
  <div id="app">
    <header>
      <h1>kb-account book -vue3</h1>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/statistic">Statistics</router-link>
        <router-link to="/profile">Profile</router-link>
        <router-link to="/account">Account</router-link>
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
