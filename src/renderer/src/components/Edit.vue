<script setup>
import { ref } from 'vue'
import { store } from '../store';
import Back from './Back.vue';
import Message from './Message.vue';
const theme = ref(false)
const capitalize = ref(false)
const message = ref(null)//提示信息
const messageTimeout = ref(null);//提示信息定时器
//展示提示信息
const showMessage = (msg) => {
    message.value = msg;
    if (messageTimeout) {
        clearTimeout(messageTimeout.value); // 清除上一次的定时器
    }
    messageTimeout.value = setTimeout(() => {
        message.value = null;
    }, 1000);
};
const themeDrop = () => {
    theme.value = !theme.value
}
const capitalizeDrop = () => {
    capitalize.value = !capitalize.value
}
const changeTheme = (theme) => {
    store.commit('setTheme', theme)
    showMessage(`Theme changed to ${theme}`)
    console.log(store.state.theme)
}
const changeSound = (sound) => {
    store.commit('setSound', sound)
    showMessage(`Sound changed to ${sound[0]}-${sound[1]}`)
    console.log(store.state.sound)
}
const changeCapitalize = (boolean) => {
    store.commit('setCapitalize', boolean)
    showMessage(`Capitalize changed to ${boolean}`)
    console.log(store.state.capitalize)
}
</script>
<template>
    <div class="wrapper"></div>
    <Back />
    <Message :message="message" />
    <div class="edit">
        <div class="option" @click="themeDrop">Theme</div>
        <div v-if="theme" class="theme">
            <div id="default" @click="changeTheme('default')">Default</div>
            <div id="pink" @click="changeTheme('pink')">Pink</div>
            <div id="black" @click="changeTheme('black')">Black</div>
        </div>
        <div class="option" @click="capitalizeDrop">Capitalize</div>
        <div v-if="capitalize" class="capitalize">
            <div @click="changeCapitalize(true)">Capitalize</div>
            <div @click="changeCapitalize(false)">Not Capitalize</div>
        </div>
    </div>
    <div class="info">
        <a
            href="https://github.com/lepusarcticus123/flash_card">sourceCode:https://github.com/lepusarcticus123/flash_card</a>
        <div>Copyright (c) 2024 lepusarcticus123
        </div>
    </div>

</template>
<style scoped>
.capitalize {
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: var(--sep);
}

.capitalize div {
    cursor: pointer;
    padding: 2vh;
    width: 15%;
    text-align: center;
}

.info {
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
    font-family: 'Playfair Display', serif;
}

.info a {

    text-decoration: none;
    color: var(--sep);
}

.info div {
    margin: 1vh 0;
    color: var(--sep);
}

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
