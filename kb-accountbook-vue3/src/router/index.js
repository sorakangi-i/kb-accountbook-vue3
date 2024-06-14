import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Account from '../pages/Account.vue';
import Statistic from '../pages/Stastistic.vue';
import Profile from '../pages/Profile.vue';
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/statistic', name: 'Statistic', component: Statistic },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/account', name: 'Account', component: Account },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
