import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import Desk from './components/Desk.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/desk/:deskId', component: Desk }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
