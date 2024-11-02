// src/store/index.js
import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
const store = createStore({
  state: {
    desks: [], //书桌
    theme: 'default', //主题
    sound: ['US', 'female'], //声音
    streak: 0, // 连续完成天数
    lastCompletedDate: null // 上一次完成任务的日期
  },
  mutations: {
    setTheme(state, theme) {
      state.theme = theme
    },
    setSound(state, sound) {
      state.sound = sound
    },
    setStreak(state, streak) {
      state.streak = streak
    },
    setLastCompletedDate(state, date) {
      state.lastCompletedDate = date
    },
    incrementStreak(state) {
      state.streak++
    },
    resetStreak(state) {
      state.streak = 1
    },
    setDesks(state, desks) {
      state.desks = desks
      console.log(desks)
    },
    addDesk(state, desk) {
      state.desks.push(desk)
    },
    deleteDesk(state, id) {
      const index = state.desks.findIndex((d) => d.id === id)
      if (index !== -1) {
        state.desks.splice(index, 1)
      }
    },
    updateDesk(state, { id, des }) {
      const desk = state.desks.find((d) => d.id === id)
      if (desk) {
        desk.description = des
      }
    }
  },
  // plugins: [createPersistedState()], //持久化
  actions: {
    //完成今日任务，增加连续天数
    completeTask({ state, commit }) {
      const today = new Date().toISOString().slice(0, 10)
      const lastDate = state.lastCompletedDate
      // 检查今天是否已经完成
      if (lastDate && lastDate === today) {
        return // 今天已完成，不重复计数
      }
      // 检查是否是连续一天
      const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
        .toISOString()
        .slice(0, 10)
      if (lastDate && lastDate === yesterday) {
        commit('incrementStreak') // 增加连续天数
      } else {
        commit('resetStreak') // 重置为1
      }
      // 更新最后完成日期
      commit('setLastCompletedDate', today)
    },
    //检查今天是否完成
    checkCompleted({ commit, state }) {
      const today = new Date().toISOString().slice(0, 10) // 格式化为 "YYYY-MM-DD"
      const lastDate = state.lastCompletedDate
      if (lastDate && lastDate === today) {
        return true // 今天已完成，不重复计数
      } else {
        commit('setStreak', 0)
        return false
      }
    },
    //获取所有书桌
    async loadDesks({ commit }) {
      const version = await window.api.getversion()
      const request = window.indexedDB.open('FlashCard', version)

      request.onsuccess = function (event) {
        const db = event.target.result
        const transaction = db.transaction(['desks'], 'readonly').objectStore('desks').openCursor()
        const desks = [] // 临时数组，用于存储所有 desk

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
            console.log('我是数据库', desks)
            // console.log('已遍历所有记录')
          }
        }
      }
    },
    // 添加书桌
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
          commit('addDesk', { id: deskId, name: deskName, createdAt: formattedDate })
        }

        addRequest.onerror = function () {
          console.log('添加 desk 失败')
        }
      }
    },
    //改变书桌描述
    async changeDes({ commit, state }, { id, des }) {
      try {
        const version = await window.api.getversion()
        const request = window.indexedDB.open('FlashCard', version)

        request.onsuccess = (event) => {
          const db = event.target.result
          const transaction = db.transaction(['desks'], 'readwrite')
          const objectStore = transaction.objectStore('desks')
          const getRequest = objectStore.get(id)

          getRequest.onsuccess = (event) => {
            const data = event.target.result
            if (data) {
              data.description = des
              const editRequest = objectStore.put(data)
              editRequest.onsuccess = () => {
                // 更新 Vuex 的 state 中对应的 desk
                commit('updateDesk', { id, des })
              }

              editRequest.onerror = () => console.log('Failed to update description in database')
            }
          }

          getRequest.onerror = () => console.log('Failed to retrieve desk')
        }

        request.onerror = () => console.log('Failed to open database')
      } catch (error) {
        console.log('Error changing description:', error)
      }
    },
    //删除书桌
    async deleteDesk({ commit }, id) {
      try {
        const version = await window.api.getversion()
        const request = window.indexedDB.open('FlashCard', version)

        request.onsuccess = (event) => {
          const db = event.target.result
          const transaction = db.transaction(['desks', 'cards'], 'readwrite')
          const deskObjectStore = transaction.objectStore('desks')
          const cardObjectStore = transaction.objectStore('cards')

          const getAllRequest = cardObjectStore.getAll()

          getAllRequest.onsuccess = (event) => {
            const cards = event.target.result

            // 遍历卡片，删除与书桌相关的卡片
            cards.forEach((card) => {
              cardObjectStore.delete(card.id)
            })
          }

          const deleteRequest = deskObjectStore.delete(id)

          deleteRequest.onsuccess = () => {
            // 删除 Vuex 的 state 中对应的 desk
            commit('deleteDesk', id)
          }
        }
      } catch {
        console.log('删除书桌失败')
      }
    }
  }
})

export { store }
