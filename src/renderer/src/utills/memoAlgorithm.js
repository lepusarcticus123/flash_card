const BASE_INTERVAL_HOURS = 12
/**
 * forget的记忆算法
 *
 * @async
 * @param {*} id：卡片id
 * @returns {*} message
 */
const forget = async (id) => {
  const version = await window.api.getversion()
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('FlashCard', version)
    request.onsuccess = (event) => {
      const db = event.target.result
      const transaction = db.transaction(['cards'], 'readwrite')
      const objectStore = transaction.objectStore('cards')
      const getRequest = objectStore.get(id)

      getRequest.onsuccess = (event) => {
        const data = event.target.result
        data.reviewCount = 0
        data.nextReviewTime = Date.now() // 设置为当前时间戳
        if (data.learningRatio >= 0.1) {
          data.learningRatio -= 0.1
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
 * 计算下次复习的时间间隔
 *
 * @param {*} reviewCount
 * @param {*} learningRatio
 * @param {*} difficultyFactor
 * @returns {number}
 */
const calculateNextReviewInterval = (reviewCount, learningRatio, difficultyFactor) => {
  return (
    BASE_INTERVAL_HOURS *
    Math.pow(reviewCount + 1, difficultyFactor) *
    learningRatio *
    1000 *
    60 *
    60
  )
}

/**
 * hard的记忆算法
 *
 * @async
 * @param {*} id
 * @returns {unknown}
 */
const hard = async (id) => {
  const version = await window.api.getversion()
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
        data.nextReviewTime =
          Date.now() + calculateNextReviewInterval(data.reviewCount, data.learningRatio, 1.2) // 设置为时间戳
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
 * good的记忆算法
 *
 * @async
 * @param {*} id
 * @returns {unknown}
 */
const good = async (id) => {
  const version = await window.api.getversion()
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
        data.nextReviewTime =
          Date.now() + calculateNextReviewInterval(data.reviewCount, data.learningRatio, 1.5) // 设置为时间戳
        if (data.learningRatio < 1.95) {
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
 * easy的记忆算法
 *
 * @async
 * @param {*} id
 * @returns {unknown}
 */
const easy = async (id) => {
  const version = await window.api.getversion()
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
        data.nextReviewTime =
          Date.now() + calculateNextReviewInterval(data.reviewCount, data.learningRatio, 1.8) // 设置为时间戳
        if (data.learningRatio < 1.9) {
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
