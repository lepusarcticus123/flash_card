<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const word = ref('')
const id = route.params.id
const back = () => {
    router.go(-1)
}
const save = () => {
    // 这里可以添加保存逻辑
}
const search = () => {
}
const result = reactive({ value: null }) // 使用对象包装，以便跟踪反应式
</script>

<template>
    <div class="wrapper"></div>
    <div class="back box" @click="back">
        <div>Back</div>
    </div>
    <div v-if="result.value">
        {{ result.value }} <!-- 显示 result 的内容 -->
    </div>
    <div v-else class="pretend">
        Let's Give It A Try!
        <div class="tips">
            <div class="tip ">Not Satisfied? Retry!</div>
            <div class="tip">Enter Your Word Below!</div>
            <div class="tip">We Are Good To Go!</div>
        </div>

    </div>
    <div class="querybox">
        <div class="button">Retry</div>
        <div class="query"><input v-model="word" placeholder="Search" tofocus type="text">
            <div id="search" @click="search">🔍</div>
        </div>

        <div class="button" @click="save">Save</div>
    </div>
</template>

<style scoped>
.tips {
    position: absolute;
    bottom: 1vh;
    width: 100%;
    display: flex;
}

.tip:nth-of-type(1) {
    transform: rotate(15deg) translateX(-10%);
}

.tip:nth-of-type(3) {
    transform: rotate(-15deg);
}

.tip {
    /* border: 1px solid var(--sep); */
    font-size: 3.5vh;
    font-family: 'Playfair Display';
}

.pretend {
    position: relative;
    width: 70%;
    text-align: center;
    color: var(--sep);
    font-family: 'Londrina Sketch';
    font-size: 15vh;
    height: 60vh;
    margin: 10vh auto;
    background-color: var(--main);
}

.querybox {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 12vh;
    font-family: 'Playfair Display';
    background-color: var(--main);
}

.button {
    display: inline-block;
    width: 15%;
    text-align: center;
    font-size: 3vh;
    height: 100%;
    cursor: pointer;
    color: var(--sep);
}

.querybox .query {
    width: 69%;
    display: inline-block;
    height: 100%;
    border: none;
    outline: none;
    background-color: var(--bt);
    font-size: 1.5rem;
}

.query input {
    outline: none;
    width: 80%;
    height: 12vh;
    font-size: 4vh;
    font-family: 'Playfair Display';
    border: none;
}

.query #search {
    display: inline-block;
    text-align: center;
    width: 19%;
    line-height: 11vh;
    font-size: 5vh;
    cursor: pointer;
}
</style>
