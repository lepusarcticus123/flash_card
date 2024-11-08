/**
 * 获取特定Desk的所有卡片数据
 * 返回promise把data包裹出去
 *
 * @param {*} id
 * @returns {*} data||error
 */
const loadData = async (id) => {
  const version = await window.api.getversion()
  return new Promise((resolve, reject) => {
    const data = []
    const request = window.indexedDB.open('FlashCard', version)
    request.onsuccess = (event) => {
      const db = event.target.result
      const transaction = db.transaction(['cards'], 'readonly')
      const cardStore = transaction.objectStore('cards')
      const cursorRequest = cardStore.openCursor()

      cursorRequest.onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor) {
          if (cursor.value.deskId === id) {
            data.push(cursor.value)
          }
          cursor.continue()
        } else {
          // console.log('All data loaded', data)
          resolve(data) // 数据加载完成后，返回结果
        }
      }

      cursorRequest.onerror = (event) => {
        console.error('Cursor error:', event.target.error)
        reject(event.target.error)
      }
    }

    request.onerror = (event) => {
      console.error('Database open error:', event.target.error)
      reject(event.target.error)
    }
  })
}
export default loadData
