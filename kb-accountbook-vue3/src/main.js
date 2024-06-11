<<<<<<< HEAD
// import './assets/main.css'
=======
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.css';
>>>>>>> a70765dba4c0cbc7fb255d8943e84200e9d26b05

const app = createApp(App);

app.use(createPinia());
app.use(router);

<<<<<<< HEAD
import 'bootstrap/dist/css/bootstrap.css'

app.use(createPinia())
app.use(pinia)
app.use(router)

app.mount('#app')
=======
app.mount('#app');
>>>>>>> a70765dba4c0cbc7fb255d8943e84200e9d26b05
