/**
 * exportData
 * 导出指定 desk 的数据
 * 分批导出，每次导出100条数据
 *
 * @param {*} deskId
 */
// const version = await window.func.getversion()
const exportData = (deskId) => {
  const request = indexedDB.open('FlashCard', 1)
  const batchSize = 100

  request.onsuccess = (event) => {
    const db = event.target.result
    const transaction = db.transaction(['desks', 'cards'], 'readonly')
    const desksStore = transaction.objectStore('desks')
    const cardsStore = transaction.objectStore('cards')

    //导出的数据结构
    const exportResult = {
      desk: null,
      cards: []
    }

    // 获取指定 desk
    const deskRequest = desksStore.get(deskId)
    deskRequest.onsuccess = (event) => {
      exportResult.desk = event.target.result

      // 分批导出 cards
      const exportCardsBatch = (batchIndex) => {
        const start = batchIndex * batchSize
        const end = start + batchSize
        const cursorRequest = cardsStore.openCursor()
        let currentIndex = 0
        cursorRequest.onsuccess = (event) => {
          const cursor = event.target.result
          if (cursor) {
            if (cursor.value.deskId === deskId) {
              if (currentIndex >= start && currentIndex < end) {
                exportResult.cards.push(cursor.value)
              }
              currentIndex++
            }
            // 继续遍历下一条记录
            cursor.continue()
          } else if (currentIndex >= end || currentIndex === 0) {
            // 如果遍历结束或已经没有更多数据
            if (exportResult.cards.length > 0) {
              // 导出完成，生成 JSON 文件
              const blob = new Blob([JSON.stringify(exportResult)], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `desk_${deskId}_data.json`
              a.click()
              URL.revokeObjectURL(url)
              console.log('Export complete')
            }
          } else {
            // 递归调用，处理下一批数据
            exportCardsBatch(batchIndex + 1)
          }
        }
      }

      exportCardsBatch(0) // 开始第一批导出
    }

    deskRequest.onerror = (event) => {
      console.error('Error fetching desk:', event)
    }
  }

  request.onerror = (event) => {
    console.error('Error opening IndexedDB:', event)
  }
}
export default exportData
