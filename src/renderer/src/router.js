import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './components/Home.vue'
import Desk from './components/Desk.vue'
import Add from './components/Add.vue'
import Card from './components/Card.vue'
import Edit from './components/Edit.vue'
import Congra from './components/Congra.vue'
import Search from './components/Search.vue'

const routes = [
  { path: '/', component: Home }, //主页
  { path: '/desk/:id', component: Desk }, //书桌页
  { path: '/desk/:id/add', component: Add }, //添加闪卡页
  { path: '/desk/:id/study', component: Card }, //学习闪卡页
  { path: '/edit', component: Edit }, //设置页
  { path: '/congratulations', component: Congra }, //学习完成页
  { path: '/desk/:id/card/:word', component: Search } //搜索页
]

const router = createRouter({
  history: createWebHashHistory(), // 使用 hash 模式
  routes
})

export default router
