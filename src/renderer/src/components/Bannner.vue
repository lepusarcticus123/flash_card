<script setup>
import { onMounted, ref } from 'vue';
const data = ref([])

//获取所有卡片数据
const getData = async () => {
    const version = await window.api.getversion();
    const request = window.indexedDB.open('FlashCard', version);
    request.onerror = function () {
        console.log('数据库打开失败');
    };
    request.onsuccess = (event) => {
        const db = event.target.result
        const transaction = db.transaction(['cards'], 'readonly')
        const cardStore = transaction.objectStore('cards')
        const cursorRequest = cardStore.openCursor()
        cursorRequest.onsuccess = (event) => {
            const cursor = event.target.result
            if (cursor) {
                if (cursor.value.nextReviewTime < Date.now()) {
                    data.value.push(cursor.value)
                }
                cursor.continue()
            } else {
                // console.log('All data loaded', data)
            }
        }
        cursorRequest.onerror = (event) => {
            console.error('Cursor error:', event.target.error)
        }
    }
}
onMounted(() => {
    getData()
})
getData()
</script>
<template>
    <div class="banner">
        <div class="done" v-if="data.length == 0">Congratulations!
            <p>You Made It!</p>
        </div>
        <div class="work" v-else>We Have {{ data.length }} Flash Cards Left Today!
            <p>Keep Up The Work!</p>
        </div>
    </div>
</template>
<style scoped>
.banner {
    background-color: var(--main);
    width: 90%;
    margin: 0vh auto;
    padding: 2vh 0;
    border-radius: 2px;
    font-size: 6vh;
    text-align: center;
    color: var(--sep);
    font-family: "Londrina Sketch", sans-serif;
}

.done {
    font-family: 'Poiret One';
}

.banner p {
    margin: 0;
}
</style>
