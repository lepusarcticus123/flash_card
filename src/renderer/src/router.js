import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import Desk from './components/Desk.vue'
import Add from './components/Add.vue'
const routes = [
  { path: '/', component: Home },
  { path: '/desk/:id', component: Desk },
  { path: '/desk/:id/add', component: Add }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
