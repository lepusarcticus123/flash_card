<script setup>
import { ref } from 'vue'
import { store } from '../store';
import { useRouter } from 'vue-router';
const theme = ref(false)
const sound = ref(false)
const router = useRouter()
const back = () => {
    router.go(-1)
}
const themeDrop = () => {
    theme.value = !theme.value
}
const soundDrop = () => {
    sound.value = !sound.value
}
const changeTheme = (theme) => {
    store.commit('setTheme', theme)
    console.log(store.state.theme)
}
const changeSound = (sound) => {
    store.commit('setSound', sound)
    console.log(store.state.sound)
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
        <div class="option" @click="soundDrop">Sound</div>
        <div v-if="sound" class="sound">
            <div @click="changeSound(['US', 'male'])">US-male</div>
            <div @click="changeSound(['US', 'female'])">Us-female</div>
            <div @click="changeSound(['UK', 'male'])">UK-male</div>
            <div @click="changeSound(['UK', 'female'])">UK-female</div>
        </div>
    </div>
</template>
<style scoped>
.sound {
    display: flex;
    justify-content: space-around;
}

.sound div {
    cursor: pointer;
    padding: 2vh;
    width: 15%;
    text-align: center;
    border-radius: 1vh;
    background-color: var(--main);
    margin: 1vh 0;
}

.edit {
    width: 80%;
    margin: 0 auto;
    font-family: 'Playfair Display', serif;
    background-color: var(--bt);
}

.theme {
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
