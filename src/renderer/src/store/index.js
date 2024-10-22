// src/store/index.js
import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
const store = createStore({
  state: {
    desks: [],
    theme: 'default',
    level: 'intermediate'
  },
  mutations: {
    setDesks(state, desks) {
      state.desks = desks
    },
    addDesk(state, desk) {
      console.log(state)
      state.desks.push(desk)
    },
    setTheme(state, theme) {
      state.theme = theme
    },
    setLevel(state, level) {
      state.level = level
    }
  },
  plugins: [createPersistedState()],
  actions: {
    async loadDesks({ commit }) {
      const version = await window.api.getversion()
      const request = window.indexedDB.open('FlashCard', version)

      request.onsuccess = function (event) {
        const db = event.target.result
        const transaction = db.transaction(['desks'], 'readonly').objectStore('desks').openCursor()
        const desks = [] // 在本地存储数据

        transaction.onerror = function () {
          console.log('获取数据失败')
        }

        transaction.onsuccess = async function (event) {
          const cursor = await event.target.result
          if (cursor) {
            const desk = cursor.value
            desks.push(desk) // 将当前 desk 加入临时数组
            cursor.continue() // 继续遍历游标
          } else {
            // 遍历结束时，将 desks 数组提交给 Vuex 的 state
            commit('setDesks', desks)
            console.log('已遍历所有记录')
          }
        }
      }
    },

    async addDesk({ commit }, deskName) {
      const version = await window.api.getversion()
      const request = window.indexedDB.open('FlashCard', version)

      request.onerror = function () {
        console.log('数据库打开失败')
      }

      request.onsuccess = function (event) {
        const db = event.target.result
        const transaction = db.transaction(['desks'], 'readwrite')
        const objectStore = transaction.objectStore('desks')

        const date = new Date()
        const formattedDate = `M:${date.getMonth() + 1} D:${date.getDate()}`

        // 添加新的 desk 数据
        const addRequest = objectStore.add({ name: deskName, createdAt: formattedDate })

        addRequest.onsuccess = function (event) {
          const deskId = event.target.result // 获取生成的 deskID
          console.log('deskId:', deskId)
          console.log('添加 desk 成功')

          // 成功后，将新 desk 提交给 Vuex 的 state，包括 deskId
          commit('addDesk', { id: deskId, name: deskName, createdAt: formattedDate })
        }

        addRequest.onerror = function () {
          console.log('添加 desk 失败')
        }
      }
    }
  }
})

export { store }
