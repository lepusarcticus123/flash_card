<script setup>
import { ref } from 'vue'
import { store } from '../store';
const theme = ref(false)
const level = ref(false)
const back = () => {
    window.location.href = '/'
}
const themeDrop = () => {
    theme.value = !theme.value
}
const levelDrop = () => {
    level.value = !level.value
}
const changeTheme = (theme) => {
    store.commit('setTheme', theme)
    console.log(store.state.theme)
}
const changeLevel = (level) => {
    store.commit('setLevel', level)
    console.log(store.state.level)
}
</script>
<template>
    <div class="wrapper"></div>
    <div class="back box" @click="back">
        <div>Back</div>
    </div>
    <div class="edit">
        <div class="option" @click="themeDrop">Theme</div>
        <div v-if="theme" class="theme">
            <div id="default" @click="changeTheme('default')">Default</div>
            <div id="pink" @click="changeTheme('pink')">Pink</div>
            <div id="black" @click="changeTheme('black')">Black</div>
        </div>
        <div class="option" @click="levelDrop">Level</div>
        <div v-if="level" class="level">
            <div class="le" @click="changeLevel('primary')">primary🔮</div>
            <div class="le" @click="changeLevel('intermediate')">intermediate💎</div>
            <div class="le" @clcik="changeLevel('advanced')">Advanced🪄</div>
        </div>
    </div>
</template>
<style scoped>
.le {
    padding: 2vw;
    cursor: pointer;
    width: 20vw;
    color: var(--sep);
    border-radius: 1vh;
    text-align: center;
    margin-bottom: 2vw;
    background-color: var(--main);
}

.edit {
    width: 80%;
    margin: 0 auto;
    font-family: 'Playfair Display', serif;
    background-color: var(--bt);
}

.theme,
.level {
    display: flex;
    justify-content: space-around;
    align-items: center;
}

#default,
#pink,
#black {
    padding: 2vw;
    width: 20vw;
    color: var(--sep);
    border-radius: 1vh;
    text-align: center;
}

#default {
    background-color: #dbe2ef;
}

#pink {
    background-color: #f8d7da;
}

#black {
    background-color: #3f3f3f;
    color: white;
}

.option {
    margin: 0 5vw;
    margin-bottom: 2vw;
    padding: 10px;
    border-radius: 5px;
    font-size: 2vw;
    cursor: pointer;
    color: var(--sep);
    transition: all 0.3s ease-in-out;
}
</style>
