import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import Desk from './components/Desk.vue'
import Add from './components/Add.vue'
import Card from './components/Card.vue'
const routes = [
  { path: '/', component: Home },
  { path: '/desk/:id', component: Desk },
  { path: '/desk/:id/add', component: Add },
  { path: '/desk/:id/study', component: Card }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
