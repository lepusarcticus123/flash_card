<script setup>
import Message from './Message.vue';
import { ref, onMounted, computed } from 'vue'
import { store } from '../store/index.js';
import { useRouter } from 'vue-router';
import importData from '../utills/importData.js';
onMounted(() => {
    store.dispatch('loadDesks');
})
const desks = computed(() => store.state.desks);
const router = useRouter()

let deskName = ref('')
let message = ref('')
const messageTimeout = ref(null);//提示信息定时器

const show = () => {
    document.querySelector('#dialog').style.display = 'block'
    document.querySelector('#cover').style.display = 'block'
}
const hidden = () => {
    deskName.value = ''  // 清空输入框
    document.querySelector('#cover').style.display = 'none'
    document.querySelector('#dialog').style.display = 'none'
}
//展示提示信息
const showMessage = (msg) => {
    message.value = msg;
    if (messageTimeout) {
        clearTimeout(messageTimeout.value); // 清除上一次的定时器
    }
    messageTimeout.value = setTimeout(() => {
        message.value = null;
        result.value = ''; // 一秒后清空 message
    }, 1000);
};
const save = () => {
    if (deskName.value === '') {
        showMessage('Please input a name!')
        return
    }
    if (desks.value.some(item => item.name == deskName.value)) {
        deskName.value = ''
        showMessage('This name is already used!')
        return
    }
    // 在 store 中添加 desk 后，立即隐藏对话框
    store.dispatch('addDesk', deskName.value)
        .then(() => {
            hidden()
        })
        .catch(() => {
            alert('Failed to add desk!')
        })
}
const importDesk = () => {
    document.querySelector('#file').click()
}
// 在调用 importData 的地方
const handleImport = async (event) => {
    try {
        await importData(event.target.files[0])
        console.log('Data imported, now loading desks...')
        await store.dispatch('loadDesks') // 确保在导入完成后再调用 dispatch
        console.log('Desks loaded, navigating to home...')
        router.push('/') // 或其他操作
    } catch (error) {
        console.error('Import failed:', error)
    }
}

</script>

<template>
    <div class="cover" id="cover" @click="hidden"></div>
    <Message :message="message" />
    <div id="dialog">
        <p>Name Your Desk!</p>
        <input type="text" v-model="deskName">
        <div class="button" @click="hidden">Quit</div>
        <div class="button" @click="save">Save</div>
    </div>
    <div class="bottom">
        <div @click="show"> Add </div>
        <div @click="importDesk"><input type="file" id="file" style="display:none" @change="handleImport" />Import</div>
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
    z-index: 5;
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
    display: flex;
    justify-content: space-around;
    height: 10vh;
    z-index: 5;
    font-size: 8vh;
    font-family: "Londrina Sketch", sans-serif;
    background-color: var(--bt);
}

.bottom div {
    cursor: pointer;
}
</style>
