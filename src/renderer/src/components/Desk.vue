<script setup>
import { useRoute } from 'vue-router';
import { store } from '../store';
import router from '../router';
import Study from './Study.vue';
import CardDisplay from './CardDisplay.vue';
const route = useRoute()
const desk = store.state.desks.find((desk) => desk.id == route.params.id)
const back = () => {
    window.location.href = '/'
}
const add = () => {
    router.push(`/desk/${route.params.id}/add`)
}
</script>
<template>

    <div class="wrapper"></div>
    <div class="back box" @click="back">
        <div>Back</div>
    </div>
    <div class="add box" @click="add">Add</div>
    <Study :name="desk.name" :id="desk.id"></Study>
    <CardDisplay :id="desk.id"></CardDisplay>

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