// import './assets/main.css'

const app = createApp(App);

app.use(createPinia());
app.use(router);

import 'bootstrap/dist/css/bootstrap.css';

app.use(createPinia());
app.use(pinia);
app.use(router);

app.mount('#app');
