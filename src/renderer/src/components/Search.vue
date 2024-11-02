<script setup>
//just copy Card.vue and tweak it a little bit Cuz i'm tired.😣
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import loadData from '../utills/LoadData';
const route = useRoute();
const router = useRouter();
const card = ref({})
const data = ref([]);
const back = () => {
    router.go(-1)
}
onMounted(async () => {
    data.value = await loadData(route.params.id);
    card.value = data.value.find(item => item.word === route.params.word) || {};
});
const flip = () => {
    document.querySelector('.container').classList.toggle('flip');
    document.querySelector('.select').style.display = 'flex'
}
const play = async (text) => {
    try {
        const audioData = await window.api.getaudio(text);
        const blob = new Blob([audioData], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.play();
    } catch (error) {
        console.error('Error fetching TTS audio:', error);
    }
}
</script>
<template>
    <div class="wrapper"></div>
    <div class="back box" @click="back">
        <div>Back</div>
    </div>
    <div class="container" @click="flip" v-if="card.word">
        <div id="front">
            <p>{{ card.word }}</p>
        </div>
        <div id="backside">
            <div id="word">
                <p class="main-word">{{ card.word }}</p>
                <p class="phonetic" @click="play(card.word)">
                    {{ card.phonetic }}🔉
                </p>
            </div>
            <div class="def" v-for="(def, idx) in card.definitions" :key="idx">
                <p class="part-of-speech">{{ def.part_of_speech }}</p>
                <p class="definition">-{{ def.definition }}</p>
                <p class="example" @click="play(def.example_sentence)">🔉Example: {{ def.example_sentence }}</p>
            </div>
            <div class="derivative" v-for="(der, idx) in card.derivatives" :key="idx">
                <p class="der-word">{{ der.term }} ({{ der.phonetic }})</p>
                <p class="der-pos">{{ der.part_of_speech }}</p>
                <p class="der-def">-{{ der.definition }}</p>
                <p class="der-example" @click="play(der.example_sentence)">🔉Example: {{ der.example_sentence }}</p>
            </div>
        </div>
    </div>
</template>
<style scoped>
.flip #front {
    transform: rotateY(180deg);
}

.flip #backside {
    transform: rotateY(0deg);
}

#front p {
    display: block;
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 7vw;
    font-weight: bold;
}

#front {
    cursor: pointer;
    width: 100%;
    height: 100%;
    position: relative;
    overflow-y: hidden;
}

#backside {
    transform: rotateY(180deg);
}

#front,
#backside {
    backface-visibility: hidden;
    position: absolute;
    transition: transform 0.6s;
}

/* 单词标题样式 */
.main-word {
    font-size: 3.5vw;
    font-weight: bold;
    text-align: center;
    margin-bottom: 1vh;
}

.phonetic {
    font-size: 2vw;
    text-align: center;
    cursor: pointer;
}

/* 定义部分样式 */
.def {
    width: 90%;
    padding: 1.5vw;
    font-size: 1.8vw;
    margin: 2vh auto;
    background-color: var(--bt);
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.part-of-speech {
    font-weight: bold;
    margin-bottom: 0.5vh;
}

.definition {
    margin-bottom: 1vh;
}

.example {
    margin-top: 0.5vh;
    cursor: pointer;
}

/* 派生词样式 */
.derivative {
    width: 92%;
    background: var(--bt);
    padding: 1.5vw;
    margin: 2vh auto;
    font-size: 1.8vw;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.der-word {
    font-weight: bold;
    margin-bottom: 0.5vh;
}

.der-pos,
.der-def,
.der-example {
    font-size: 1.8vw;
}

.def-example {
    cursor: pointer;
}

/* 容器样式 */
.container {
    perspective: 1000px;
    width: 70%;
    height: 65vh;
    margin: 4vh auto;
    padding: 1vw;
    overflow-y: auto;
    overflow-x: hidden;
    background: var(--main);
    color: var(--sep);
    border-radius: 10px;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
    font-family: 'Playfair Display';
}

/* 滚动条样式 */
.container::-webkit-scrollbar {
    width: 10px;
    /* 滚动条的宽度 */
}

.container::-webkit-scrollbar-track {
    background-color: var(--bt);
    /* 设置滚动条背景色 */
}

.container::-webkit-scrollbar-thumb {
    background-color: var(--head);
    /* 设置滑块颜色 */
    border: 3px solid var(--main);
    /* 为滑块添加边框，颜色与背景色一致 */
}

.container::-webkit-scrollbar-thumb:hover {
    background-color: var(--bt);
    /* 滑块悬停时的颜色变化 */
}
</style>