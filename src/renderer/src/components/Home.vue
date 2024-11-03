<script setup>
import Bannner from './Bannner.vue'
import Desks from './Desks.vue'
import Bottom from './Bottom.vue'
// indexedDB.deleteDatabase('FlashCard');  // 删除数据库，用于测试
import { onMounted, ref, watch } from 'vue';
import { store } from '../store';
const data = ref([]);
const getData = async () => {
    data.value = []; // 清空旧数据
    const version = await window.api.getversion();
    const request = window.indexedDB.open('FlashCard', version);
    request.onerror = function () {
        console.log('数据库打开失败');
    };
    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['cards'], 'readonly');
        const cardStore = transaction.objectStore('cards');
        const cursorRequest = cardStore.openCursor();
        cursorRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                if (cursor.value.nextReviewTime <= Date.now()) {
                    data.value.push(cursor.value);
                }
                cursor.continue();
            } else {
                console.log('这是刷新后的cards数据', data);
            }
        };
        cursorRequest.onerror = (event) => {
            console.error('Cursor error:', event.target.error);
        };
    };
};
watch(() => store.state.desks.length, () => {
    getData();
}, { immediate: true });
</script>
<template>
    <div class="wrapper"></div>
    <Bannner :data="data" />
    <div class="main">
        <Desks />
    </div>
    <Bottom />
</template>
<style>
.wrapper {
    background-color: var(--bg);
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    z-index: -1;
}

.main {
    width: 90%;
    padding-top: 0.5vh;
    padding-bottom: max(10vh, 50px);
    margin: 2vh auto;
    background-color: var(--main);
}
</style>