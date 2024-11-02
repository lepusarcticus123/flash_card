import { createApp } from 'vue'
import App from './App.vue'
import { store } from './store'
import router from './router'
createApp(App).use(store).use(router).mount('#app')

//初始化数据库
const openDB = async () => {
  const version = await window.api.getversion()
  const request = window.indexedDB.open('FlashCard', version) // 指定数据库版本
  // 处理数据库打开失败
  request.onerror = function () {
    console.log('数据库打开失败')
  }
  request.onsuccess = function (event) {
    const db = event.target.result
    console.log('数据库打开成功', db)
  }
  // 处理数据库升级（当版本号提升时触发）
  request.onupgradeneeded = function (event) {
    const db = event.target.result
    console.log(event)
    if (!db.objectStoreNames.contains('desks')) {
      const deskStore = db.createObjectStore('desks', { keyPath: 'id', autoIncrement: true }) // 使用 'id' 作为主键，并自动递增
      deskStore.createIndex('name', 'name', { unique: true }) // desk 名称索引
      deskStore.createIndex('createdAt', 'createdAt', { unique: false }) // 创建时间索引
      deskStore.createIndex('description', 'description', { unique: false }) // 描述索引
    }
    if (!db.objectStoreNames.contains('cards')) {
      const cardStore = db.createObjectStore('cards', { keyPath: 'id', autoIncrement: true }) // 使用 'id' 作为主键，并自动递增为单词
      cardStore.createIndex('word', 'word', { unique: true }) // 单词唯一索引
      cardStore.createIndex('phonetic', 'phonetic', { unique: false }) // 音标
      cardStore.createIndex('definitions', 'definitions', { unique: false }) // 释义
      cardStore.createIndex('derivatives', 'derivatives', { unique: false }) // 派生词
      cardStore.createIndex('nextReviewTime', 'nextReviewTime', { unique: false }) // 下次复习时间
      cardStore.createIndex('reviewCount', 'reviewCount', { unique: false }) // 复习次数
      cardStore.createIndex('deskId', 'deskId', { unique: false }) // 关联到 desk 的 deskId
      cardStore.createIndex('learningRatio', 'learningRatio', { unique: false }) // 增加 learningRatio 字段，默认值为 50%
    }
    console.log('数据库创建或升级成功')
  }
}
openDB()
