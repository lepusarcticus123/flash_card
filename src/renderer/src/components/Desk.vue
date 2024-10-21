<script setup>
import { useRoute } from 'vue-router';
import { store } from '../store';
import router from '../router';
import Study from './Study.vue';
import CardDisplay from './CardDisplay.vue';
import loadData from '../utills/LoadData';
import { reactive } from 'vue';
const route = useRoute()
const data = reactive([])
const desk = store.state.desks.find((desk) => desk.id == route.params.id)
const back = () => {
    window.location.href = '/'
}
const add = () => {
    router.push(`/desk/${route.params.id}/add`)
}
const loadCards = async () => {
    try {
        data = await loadData(props.id);
    }
    catch {
        console.log("loadCards error")
    }
}
loadCards()
</script>
<template>

    <div class="wrapper"></div>
    <div class="back box" @click="back">
        <div>Back</div>
    </div>
    <div class="add box" @click="add">Add</div>
    <Study :name="desk.name" :id="desk.id" :data="data"></Study>
    <CardDisplay :id="desk.id" :data="data"></CardDisplay>
</template>
<style>
.box {
    display: flex;
    font-size: 3vw;
    font-family: "Londrina Sketch", sans-serif;
    color: var(--font);
    position: absolute;
    /* 将其放置在容器的最左侧 */
    justify-content: center;
    align-items: center;
    margin-top: 2px;
    width: 10vh;
    background-color: var(--head);
    height: 9vh;
    border-radius: 8px;
    cursor: pointer;
}

.back {
    left: 0;
    margin-left: 3vh;
}

.add {
    margin-right: 3vh;
    right: 0;
}
</style>