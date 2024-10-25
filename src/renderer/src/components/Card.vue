<script setup>
import { useRoute, useRouter } from 'vue-router';
import loadData from '../utills/LoadData';
import { reactive } from 'vue';
const route = useRoute()
const router = useRouter()
const data = reactive([])
const id = route.params.id
const back = () => {
    router.go(-1)
}
const flip = () => {
    document.querySelector('.select').style.display = 'flex'
    document.querySelector('#more').style.display = 'block'
}

//加载所有数据
const loadCards = async () => {
    try {
        data = await loadData(id)
    }
    catch {
        console.log('load data error')
    }
}
loadCards()
//卡片索引
// let index=ref(0)
//复习操作
// const forget = () => {
//     const request = window.indexedDB.open('FlashCard', '1')
//     request.onsuccess = (event) => {
//         const db = event.target.result
//         const transaction = db.transaction(['cards'], 'readwrite').objectStore('cards')
//         const card = transaction.get(route.params.id)

//     }
// }
</script>

<template>
    <div class="wrapper"></div>
    <div class="back box" @click="back">
        <div>Back</div>
    </div>
    <div class="container" @click="flip">
        <div>HAHA</div>
        <div id="more">
            <div class="li">1212</div>
            <div class="li">1212</div>
            <div class="li">1212</div>
            <div class="li">1212</div>
            <div class="li">1212</div>
            <div class="li">1212</div>
            <div class="li">1212</div>
            <div class="li">1212</div>
            <div class="li">1212</div>
            <div class="li">1212</div>
            <div class="li">1212</div>
            <div class="li">1212</div>
            <div class="li">1212</div>
            <div class="li">1212</div>
            <div class="li">1212</div>
            <div class="li">1212</div>
            <div class="li">1212</div>
            <div class="li">1212</div>
            <div class="li">1212</div>
            <div class="li">1212</div>
        </div>
    </div>
    <div class="select">
        <div @click="forget">😣Forget</div>
        <div @click="hard">😳Hard</div>
        <div @click="good">🤗Good</div>
        <div @click="easy">🤩Easy</div>
    </div>
</template>
<style scoped>
#more {
    display: none;
}

.container {
    cursor: pointer;
    overflow-y: scroll;
    position: relative;
    width: 70%;
    text-align: center;
    color: var(--sep);
    font-family: 'Playfair Display';
    height: 60vh;
    margin: 10vh auto;
    margin-bottom: 4vh;
    background-color: var(--main);

}

/* 针对 Webkit 浏览器（如 Chrome 和 Safari） */
.container::-webkit-scrollbar {
    width: 10px;
    /* 滚动条的宽度 */
}

/* 滚动条轨道 */
.container::-webkit-scrollbar-track {
    background-color: var(--bt);
    /* 设置滚动条背景色 */
}

/* 滚动条滑块 */
.container::-webkit-scrollbar-thumb {
    background-color: var(--head);
    /* 设置滑块颜色 */
    border: 3px solid var(--main);
    /* 为滑块添加边框，颜色与背景色一致 */
}

/* 悬停时的滑块样式 */
.container::-webkit-scrollbar-thumb:hover {
    background-color: var(--bt);
    /* 滑块悬停时的颜色变化 */
}

.select {
    display: none;
    width: 100%;
    /* display: flex; */
    justify-content: space-around;
    align-items: center;
}

.select div {
    cursor: pointer;
    font-size: 3vh;
    color: var(--sep);
    border-radius: 10px;
    background-color: var(--main);
    padding: 3vw;
    transition: all 0.3s ease-in-out;
}

.select div:hover {
    background-color: var(--sep);
    color: var(--main);
}
</style>