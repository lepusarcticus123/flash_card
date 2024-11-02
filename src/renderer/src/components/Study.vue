<script setup>
import { defineProps, watch, ref } from 'vue';
import { store } from '../store';
import router from '../router';

const props = defineProps(['desk', 'data']);

const total = ref(0)
const review = ref(0)
const notStudied = ref(0)

const des = ref(props.desk ? props.desk.description : ''); // 初始检查
console.log('我是desk页', props.data)
//更新卡片复习数
const updateCounts = () => {
    total.value = props.data.filter((item) => item.nextReviewTime < Date.now())
    review.value = props.data.filter((item) => item.nextReviewTime < Date.now() && item.reviewCount > 0)
    notStudied.value = props.data.filter(item => item.reviewCount == 0)
}
//监视卡片数据变化
watch(() => props.data, updateCounts, { immediate: true });

</script>

<template>
    <div class="study">
        <div class="title">
            <div>{{ desk.name }}</div>
            <input type="text" v-model="des" @keypress.enter="store.dispatch('changeDes', { id: desk.id, des })"
                :placeholder="desk.description ? ' - ' + desk.description : 'This is a default description, press enter to change it'">

        </div>
        <p>
            <span v-if="total.length > 0">😳</span>
            <span v-else>🤩</span>Cards For Today

        </p>
        <div class="info">
            <div class="number">{{ total.length }}</div>
            <div class="container">
                <div>🔎{{ notStudied.length }}</div>
                <p>Not Studied</p>
            </div>
            <div class="container">
                <div>✨{{ review.length }}</div>
                <p>To Review</p>
            </div>

        </div>
        <div id="study" @click="router.push({ path: '/desk/' + props.desk.id + '/study' })" v-if="total.length > 0">
            Study!🎐</div>
    </div>
</template>
<style scoped>
.title div {
    width: 30%;
    display: inline-block;
}

.title input {
    padding: 1vw;
    font-size: 1.8vw;
    font-family: 'Playfair Display', sans-serif;
    border: 0;
    background-color: var(--main);
    border-bottom: 1px solid var(--sep);
    outline: none;
    display: inline-block;
    width: 67%;
}

#study {
    width: 94%;
    margin: 0 auto;
    margin-top: 3vw;
    padding: 2vw;
    border-radius: 5px;
    text-align: center;
    font-size: 2vw;
    color: var(--sep);
    background-color: var(--bt);
    cursor: pointer;
    font-family: "Playfair Display", sans-serif;
    transition: all 0.5s ease-in-out;
}

#study:hover {
    background-color: var(--sep);
    color: var(--bt);
}

.number {
    border-radius: 50%;
    font-size: 6vw;
    text-align: center;
    line-height: 8vw;
    color: var(--sep);
    width: 10vw;
    height: 10vw;
    background-color: var(--main);
}

.container {
    padding-left: 3vw;
    text-align: center;
    font-size: 2.5vw;
}

.info {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2vw;
    color: var(--sep);
    font-family: "Playfair Display", sans-serif;
    font-size: 2vw;
}

.study p {
    color: var(--sep);
    font-size: 2vw;
    padding: 2vw 3vw;
}

.info {
    width: 94%;
    border-radius: 5px;
    margin: 0 auto;
    background-color: var(--bt);
}

.study {
    background-color: var(--main);
    margin: 0 15vh;
    padding: 2vw;
    font-family: "Playfair Display", sans-serif;
    border-radius: 6px;
}

.study .title {
    padding-left: 2vw;
    font-size: 3vw;
    color: var(--sep);

}
</style>