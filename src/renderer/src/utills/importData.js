/**
 * importData
 * 用于导入数据到 indexedDB
 * 分批导入，避免一次性加载的压力
 * 更好的错误恢复
 * 减少事务冲突
 *
 * @param {*} file
 */
// const version = await window.func.getversion()
const importData = async (file) => {
  const version = await window.func.getversion()
  const reader = new FileReader()
  const batchSize = 100 // 每次导入100条数据

  reader.onload = (event) => {
    const data = JSON.parse(event.target.result)
    const request = indexedDB.open('FlashCard', version)

    request.onsuccess = (event) => {
      const db = event.target.result

      // 分批插入的函数
      const insertBatch = (store, dataArray, batchIndex) => {
        const start = batchIndex * batchSize
        const end = start + batchSize
        const batch = dataArray.slice(start, end)

        if (batch.length === 0) return Promise.resolve() // 递归终止条件

        return new Promise((resolve, reject) => {
          const transaction = db.transaction(store, 'readwrite')
          const objectStore = transaction.objectStore(store)

          batch.forEach((item) => {
            const request = objectStore.add(item)
            request.onsuccess = () => console.log(`Inserted: ${item}`)
            request.onerror = (event) => reject(event)
          })

          transaction.oncomplete = () => resolve()
          transaction.onerror = (event) => reject(event)
        })
      }

      // 插入 desk
      const insertDesk = () => {
        return new Promise((resolve, reject) => {
          const transaction = db.transaction('desks', 'readwrite')
          const desksStore = transaction.objectStore('desks')
          const request = desksStore.add(data.desk)
          request.onsuccess = () => resolve()
          request.onerror = (event) => reject(event)
        })
      }

      // 插入 cards
      const insertAllCards = async () => {
        const totalBatches = Math.ceil(data.cards.length / batchSize)
        for (let i = 0; i < totalBatches; i++) {
          await insertBatch('cards', data.cards, i)
        }
      }

      // 先插入 desk 再分批插入 cards
      insertDesk()
        .then(insertAllCards)
        .then(() => {
          console.log('Import complete')
        })
        .catch((error) => {
          console.error('Error importing data:', error)
        })
    }

    request.onerror = (event) => {
      console.error('Error opening IndexedDB:', event)
    }
  }

  reader.readAsText(file)
}
