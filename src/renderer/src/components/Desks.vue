<script setup>
import { onMounted, computed } from 'vue';
import { store } from '../store/index.js';
onMounted(() => {
    store.dispatch('loadDesks');
})
const desks = computed(() => store.state.desks);
console.log('desks', desks)
</script>
<template>
    <div v-for="desk in desks" key="desk.name">
        <div class="desk" @click="study">
            <div id="title">{{ desk.name }}</div>
            <div id="description">This Is A Description </div>
        </div>
    </div>

</template>
<style scoped>
.desk {
    width: 85%;
    height: max(14vh, 50px);
    margin: 2vh 5vw;
    padding: 1vh;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    border-radius: 5px;
    color: var(--font);
    position: relative;
    overflow: hidden;
    background-color: var(--desk);
    font-family: "Playfair Display", sans-serif;
}

#title {
    padding-left: 2.5vw;
    font-size: 3.5vh;
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