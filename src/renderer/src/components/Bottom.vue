<script setup>
import { ref } from 'vue'
import { store } from '../store/index.js';

let deskName = ref('')

const show = () => {
    document.querySelector('#dialog').style.display = 'block'
    document.querySelector('#cover').style.display = 'block'
}

const hidden = () => {
    deskName.value = ''  // 清空输入框
    document.querySelector('#cover').style.display = 'none'
    document.querySelector('#dialog').style.display = 'none'
}

const save = () => {
    if (deskName.value === '') {
        alert('👉 Please input your desk name')
        return
    }
    // 在 store 中添加 desk 后，立即隐藏对话框
    store.dispatch('addDesk', deskName.value)
        .then(() => {
            hidden()  // 确保添加 desk 成功后隐藏对话框
        })
        .catch(() => {
            alert('Failed to add desk!')
        })
}
</script>

<template>
    <div class="cover" id="cover" @click="hidden"></div>
    <div id="dialog" @click.stop>
        <p>Name Your Desk!</p>
        <input type="text" v-model="deskName">
        <div class="button" @click="hidden">Quit</div>
        <div class="button" @click="save">Save</div>
    </div>
    <div class="bottom">
        <div class="round" @click="show"> + </div>
    </div>
</template>

<style scoped>
.cover {
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    display: none;
    background-color: black;
    opacity: 0.4;
}

#dialog {
    text-align: center;
    font-size: min(4.5vh, 5vw);
    display: none;
    width: 25vw;
    height: 25vh;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border: 1px solid var(--sep);
    border-radius: 10px;
    z-index: 10;
}

#dialog .button {
    width: 40%;
    height: 5vh;
    display: inline-block;
    font-size: min(3vw, 3vh);
    margin: 1vh auto;
    cursor: pointer;
    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
}

#dialog p {
    margin: 1vh;
    font-family: "Londrina Sketch", serif;
}

#dialog input {
    width: 80%;
    height: min(20%, 10vh);
    border: 1px solid var(--sep);
    border-radius: 10px;
    font-size: 3vh;
    outline: none;
}

.bottom {
    border-top: 1px solid var(--sep);
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 10vh;
    z-index: 5;
    font-family: "Londrina Sketch", sans-serif;
    background-color: var(--bt);
}

.round {
    width: 10vh;
    height: 10vh;
    margin: 0 auto;
    font-size: 13vh;
    text-align: center;
    line-height: 60%;
    color: var(--head);
    cursor: pointer;
}
</style>
