/**
 * importData
 * 用于导入数据到 indexedDB
 * 分批导入，避免一次性加载的压力
 * 更好的错误恢复
 * 减少事务冲突
 *
 * @param {*} file
 */
const importData = async (file) => {
  const version = await window.api.getversion()
  const reader = new FileReader()
  const batchSize = 100 // 每次导入100条数据

  return new Promise((resolve, reject) => {
    reader.onload = async (event) => {
      const data = JSON.parse(event.target.result)
      const request = indexedDB.open('FlashCard', version)

      request.onsuccess = async (event) => {
        const db = event.target.result

        // 插入 desk
        const insertDesk = () => {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction('desks', 'readwrite')
            const desksStore = transaction.objectStore('desks')

            const checkRequest = desksStore.get(data.desk.id)
            checkRequest.onsuccess = (event) => {
              if (event.target.result) {
                data.desk.id += '_imported' // 若存在冲突，则修改ID
              }
              const addRequest = desksStore.add(data.desk)
              addRequest.onsuccess = () => {
                console.log(`Inserted desk: ${data.desk}`)
                resolve() // 在这里 resolve
              }
              addRequest.onerror = (event) => reject(event)
            }
            checkRequest.onerror = (event) => reject(event)
          })
        }

        // 分批插入的函数
        const insertBatch = (dataArray, batchIndex) => {
          return new Promise((resolve) => {
            const start = batchIndex * batchSize
            const end = start + batchSize
            const batch = dataArray.slice(start, end)
            if (batch.length === 0) return resolve() // 递归终止条件

            const transaction = db.transaction('cards', 'readwrite')
            const objectStore = transaction.objectStore('cards')
            const promises = batch.map((item) => {
              return new Promise((resolve) => {
                const checkRequest = objectStore.get(item.id)
                checkRequest.onsuccess = (event) => {
                  if (event.target.result) {
                    item.id += '_imported' // 若存在冲突，则修改ID
                  }
                  const addRequest = objectStore.add(item)
                  addRequest.onsuccess = () => {
                    console.log(`Inserted card: ${item}`)
                    resolve()
                  }
                  addRequest.onerror = (event) => {
                    console.error('Error inserting card:', event)
                    resolve() // 即使出错也要继续
                  }
                }
                checkRequest.onerror = (event) => {
                  console.error('Error checking card:', event)
                  resolve() // 即使出错也要继续
                }
              })
            })

            Promise.all(promises).then(resolve) // 等待所有插入完成
          })
        }

        // 插入所有 cards
        const insertAllCards = async () => {
          const totalBatches = Math.ceil(data.cards.length / batchSize)
          for (let i = 0; i < totalBatches; i++) {
            await insertBatch(data.cards, i) // 确保插入卡片的顺序
          }
        }

        // 先插入 desk 再分批插入 cards
        await insertDesk() // 等待插入 desk 完成
        await insertAllCards() // 然后插入 cards
        console.log('Import complete')
        resolve(data.desk.id) // 确保导入完成后返回 desk.id
      }

      request.onerror = (event) => {
        console.error('Error opening IndexedDB:', event)
        reject(event)
      }
    }

    reader.readAsText(file)
  })
}

export default importData
