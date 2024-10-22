<script setup>
import { defineProps, reactive, ref } from 'vue';
import router from '../router';

const props = defineProps(['id', 'name', 'data']);
const total = ref(0)
const review = ref(0)
const notStudied = ref(0)

const study = () => {
    router.push({ path: '/desk/' + props.id + '/study' });
};
total.value = props.data.length
review.value = props.data.filter((item) => item.reviewCount > 0).length
notStudied.value = props.data.filter(item => item.reviewCount == 0).length
</script>

<template>
    <div class="study">
        <div class="title">{{ name }}</div>
        <p>Cards For Today😳</p>
        <div class="info">
            <div class="number">{{ total }}</div>
            <div class="container">
                <div>🔎{{ notStudied }}</div>
                <p>Not Studied</p>
            </div>
            <div class="container">
                <div>✨{{ review }}</div>
                <p>To Review</p>
            </div>

        </div>
        <div id="study" @click="study">Study!🎐</div>
    </div>
</template>
<style scoped>
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