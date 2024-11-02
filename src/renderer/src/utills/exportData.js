/**
 * exportData
 * 导出指定 desk 的数据
 * 分批导出，每次导出100条数据
 *
 * @param {*} deskId
 */
const exportData = async (deskId) => {
  try {
    const version = await window.api.getversion()
    const request = indexedDB.open('FlashCard', version)

    const batchSize = 100

    request.onsuccess = (event) => {
      const db = event.target.result
      const transaction = db.transaction(['desks', 'cards'], 'readonly')
      const desksStore = transaction.objectStore('desks')
      const cardsStore = transaction.objectStore('cards')

      const exportResult = {
        desk: null,
        cards: []
      }

      const deskRequest = desksStore.get(Number(deskId))
      deskRequest.onsuccess = (event) => {
        exportResult.desk = event.target.result
        console.log(event.target.result)

        if (!exportResult.desk) {
          console.error('Desk not found.')
          return
        }

        const exportCardsBatch = (batchIndex) => {
          const start = batchIndex * batchSize
          let currentIndex = 0
          let batchEndReached = false

          const cursorRequest = cardsStore.openCursor()
          cursorRequest.onsuccess = (event) => {
            const cursor = event.target.result

            if (cursor && !batchEndReached) {
              if (cursor.value.deskId === deskId) {
                if (currentIndex >= start && currentIndex < start + batchSize) {
                  exportResult.cards.push(cursor.value)
                }
                currentIndex++
                if (currentIndex >= start + batchSize) {
                  batchEndReached = true
                }
              }
              cursor.continue()
            } else if (!cursor || batchEndReached) {
              if (exportResult.cards.length > 0) {
                const blob = new Blob([JSON.stringify(exportResult)], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `desk_${deskId}_data.json`
                a.click()
                URL.revokeObjectURL(url)
                console.log('Export complete')
              } else {
                console.log('No cards found for this desk.')
              }
            }
          }
        }

        exportCardsBatch(0)
      }

      deskRequest.onerror = (event) => {
        console.error('Error fetching desk:', event)
      }
    }

    request.onerror = (event) => {
      console.error('Error opening IndexedDB:', event)
    }
  } catch (error) {
    console.error('Error in exportData function:', error)
  }
}
export default exportData
