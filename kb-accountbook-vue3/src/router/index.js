import { createRouter, createWebHistory } from 'vue-router';
import Home from '../../pages/Home.vue';
import Profile from '@/pages/Profile.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/account',
    name: 'Account',
    component: Table,
  },
  {
    path: '/',
    name: 'Profile',
    component: Profile,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
