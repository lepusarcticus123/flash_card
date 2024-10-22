/**
 * 忘记
 * 次数，下次复习时间重置
 * 学习率下降0.1
 *
 * @param {*} id
 */
// const version = await window.func.getversion()
const forget = async (id) => {
  const version = await window.func.getversion()
  return newPromise((resolve, reject) => {
    const request = window.indexedDB.open('FlashCard', version)
    request.onsuccess = (event) => {
      const db = event.target.result
      const transaction = db.transaction(['cards'], 'readwrite')
      const objectStore = transaction.objectStore('cards')
      const getRequest = objectStore.get(id)

      getRequest.onsuccess = (event) => {
        const data = event.target.result
        data.reviewCount = 0
        data.nextReviewDate = new Date() // 复习时间重置为当前时间
        if (data.learningRatio > 0.1) {
          data.learningRatio -= 0.1 // 学习率降低
        }
        const editRequest = objectStore.put(data)
        editRequest.onsuccess = () => {
          resolve('forget accomplished')
        }
        editRequest.onerror = () => {
          reject('forget failed')
        }
      }
    }
  })
}

/**
 * 艰难
 * 次数增加
 * 学习率下降0.05
 *
 * @param {*} id
 */
const hard = async (id) => {
  const version = await window.func.getversion()
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('FlashCard', version)
    request.onsuccess = (event) => {
      const db = event.target.result
      const transaction = db.transaction(['cards'], 'readwrite')
      const objectStore = transaction.objectStore('cards')

      const getRequest = objectStore.get(id)
      getRequest.onsuccess = (event) => {
        const data = event.target.result
        data.reviewCount += 1
        const currentTime = new Date().getTime()
        data.nextReviewDate = new Date(
          currentTime + data.reviewCount * (1 + data.learningRatio) * 1000 * 60 * 60 * 12
        ) // 12小时
        if (data.learningRatio > 0.05) {
          data.learningRatio -= 0.05
        }
        const editRequest = objectStore.put(data)
        editRequest.onsuccess = () => {
          resolve('hard accomplished')
        }
        editRequest.onerror = () => {
          reject('hard failed')
        }
      }
    }
  })
}

/**
 * 良好
 * 次数增加，学习率上升0.05
 *
 * @param {*} id
 */
const good = async (id) => {
  const version = await window.func.getversion()
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('FlashCard', version)
    request.onsuccess = (event) => {
      const db = event.target.result
      const transaction = db.transaction(['cards'], 'readwrite')
      const objectStore = transaction.objectStore('cards')

      const getRequest = objectStore.get(id)
      getRequest.onsuccess = (event) => {
        const data = event.target.result
        data.reviewCount += 1
        const currentTime = new Date().getTime()
        data.nextReviewDate = new Date(
          currentTime + data.reviewCount * (1 + data.learningRatio) * 1000 * 60 * 60 * 48
        ) // 48小时
        if (data.learningRatio < 0.95) {
          data.learningRatio += 0.05
        }
        const editRequest = objectStore.put(data)
        editRequest.onsuccess = () => {
          resolve('good accomplished')
        }
        editRequest.onerror = () => {
          reject('good failed')
        }
      }
    }
  })
}

/**
 * 轻松
 * 次数增加，学习率上升0.1
 *
 * @param {*} id
 */
const easy = async (id) => {
  const version = await window.func.getversion()
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('FlashCard', version)
    request.onsuccess = (event) => {
      const db = event.target.result
      const transaction = db.transaction(['cards'], 'readwrite')
      const objectStore = transaction.objectStore('cards')

      const getRequest = objectStore.get(id)
      getRequest.onsuccess = (event) => {
        const data = event.target.result
        data.reviewCount += 1
        const currentTime = new Date().getTime()
        data.nextReviewDate = new Date(
          currentTime + data.reviewCount * (1 + data.learningRatio) * 1000 * 60 * 60 * 120
        ) // 120小时
        if (data.learningRatio < 0.9) {
          data.learningRatio += 0.1
        }
        const editRequest = objectStore.put(data)
        editRequest.onsuccess = () => {
          resolve('easy accomplished')
        }
        editRequest.onerror = () => {
          reject('easy failed')
        }
      }
    }
  })
}

export { forget, hard, good, easy }
