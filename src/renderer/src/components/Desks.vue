<script setup>
import { onMounted, computed } from 'vue';
import router from '../router.js';
import { store } from '../store/index.js';
onMounted(() => {
    store.dispatch('loadDesks');
})
const desks = computed(() => store.state.desks);
</script>
<template>
    <div v-for="desk in desks" key="desk.id">
        <div>
            <div class="desk" @click="study">
                <div @click="router.push(`/desk/${desk.id}`)">{{ desk.name }}</div>
                <div @click="router.push(`/desk/${desk.id}`)">{{ desk.createdAt }}</div>
                <div @click="router.push(`/desk/${desk.id}`)" v-if="desk.description">{{ desk.description }}</div>
                <div @click="router.push(`/desk/${desk.id}`)" v-else>This is a default description.</div>
                <div @click="store.dispatch('deleteDesk', desk.id)">Delete</div>
            </div>
        </div>
    </div>
</template>
<style scoped>
a {
    text-decoration: none;
}

.desk {
    width: 85%;
    height: max(14vh, 50px);
    margin: 2vh 5vw;
    padding: 1vh;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    border-radius: 5px;
    color: var(--sep);
    position: relative;
    overflow: hidden;
    background-color: var(--bt);
    font-family: "Playfair Display", sans-serif;
}

.desk div:nth-of-type(2n+1) {
    padding-left: 2.5vw;
    font-size: 3.5vh;
    width: 75%;
    display: inline-block;
}

.desk div:nth-of-type(2n) {
    width: 20%;
    text-align: center;
    display: inline-block;
}

.desk div:nth-of-type(3) {
    font-size: 2.5vh;
}

.desk div:nth-of-type(4) {
    margin-top: 1vh;
    border-radius: 1vh;
    font-size: 3vh;
    z-index: 5;
    background-color: var(--head);
    color: var(--bt);
    padding: 1.5vh 0;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
}

.desk div:nth-of-type(4):hover {
    background-color: var(--bt);
    color: var(--sep);
}

#description {
    padding-top: 2vh;
    padding-left: 3.5vw;
    font-size: 2.2vh;
}

#remove {
    float: right;
    width: 10%;
    height: 60%;
    font-size: 7vh;
    border-radius: 1vh;
    border: 1px solid var(--sep);
    text-align: center;
    font-family: "Londrina Sketch", sans-serif;
}
</style>