<script setup>
import Back from './Back.vue';
import { useRoute, useRouter } from 'vue-router';
import loadData from '../utills/LoadData';
import { onMounted, ref, computed } from 'vue';
import { store } from '../store';

const sound = computed(() => store.state.sound)
const capitalize = computed(() => store.state.capitalize)
const className = ref('')
if (capitalize.value == true) {
    className.value = 'capitalize'
} else {
    className.value = 'non-capitalize'
}
const route = useRoute()
const router = useRouter()

const desk_id = route.params.id
console.log(route.params.word)
let index = ref(0)
//翻转
const flip = (event) => {
    document.querySelector('.container').classList.toggle('flip');

}
//存储书桌中需要复习的卡片
const data = ref([])
onMounted(async () => {
    try {
        await loadData(desk_id).then(val => {
            data.value = val.find((item) => item.word === route.params.word)
        })
    }
    catch {
        console.log('load data error')
    }
})
//播放声音
const play = async (event, text) => {
    try {
        //responseType: 'arraybuffer'
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
    <Back />
    <div :class="className">
        <div class="container" v-if="data">
            <div id="front" @click="flip">
                <p>{{ data.word }}</p>
            </div>
            <div id="backside">
                <div id="word">
                    <p class="main-word">{{ data.word }}</p>
                    <p class="phonetic" @click.stop="play(data.word)">
                        {{ data.phonetic }}🔉
                    </p>
                </div>
                <p class="classify">💫Definitions</p>
                <div class="def" v-for="(def, idx) in data.definitions" :key="idx">
                    <p class="part-of-speech">{{ def.part_of_speech }}</p>
                    <p class="definition" @click.stop="play(def.definition)">-{{ def.definition }}</p>
                    <p class="example" @click.stop="play(def.example_sentence)">🔉Example: {{ def.example_sentence }}
                    </p>
                </div>
                <hr>
                <p class="classify">🎊Derivatives</p>
                <div class="derivative" v-for="(der, idx) in data.derivatives" :key="idx">
                    <p class="der-word" @click.stop="play(der.term)">{{ der.term }} ({{ der.phonetic }})</p>
                    <p class="der-pos">{{ der.part_of_speech }}</p>
                    <p class="der-def" @click.stop="play(der.definition)">-{{ der.definition }}</p>
                    <p class="der-example" @click.stop="play(der.example_sentence)">🔉Example: {{ der.example_sentence
                        }}</p>
                </div>
                <hr>
                <p class="classify">🎢Common Phrases</p>
                <div v-if="data.common_phrases" class="common_phrases" v-for="(phrase, index) in data.common_phrases">
                    <p @click.stop="play(phrase.term)">{{ phrase.term }}</p>
                    <p>-{{ phrase.definition }}</p>
                    <p @click.stop="play(phrase.example_sentence)">🔉Example:{{ phrase.example_sentence }}</p>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
.common_phrases {
    width: 90%;
    padding: 1.5vw;
    font-size: 1.8vw;
    margin: 2vh auto;
    background-color: var(--bt);
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.common_phrases p:nth-of-type(1) {
    font-size: 2vw;
    font-weight: bold;
    cursor: pointer;
}

.common_phrases p:nth-of-type(2) {
    text-transform: var(--cap);
}

.common_phrases p:nth-of-type(3) {
    margin-top: 0.5vh;
    cursor: pointer;
    text-transform: var(--cap);
}

.common_phrases p {
    margin-top: 0.5vh;
}

.classify {
    font-size: 3vh;
    font-weight: bold;
    font-family: 'Poiret One';
    margin: 0 3vw;
    margin-bottom: 1vh;
}

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
    width: 100%;
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
    cursor: pointer;
    text-transform: var(--cap);
}

.example {
    margin-top: 0.5vh;
    cursor: pointer;
    font-weight: 400;
    text-transform: var(--cap);
}

/* 派生词样式 */
.derivative {
    width: 90%;
    background: var(--bt);
    padding: 1.5vw;
    margin: 2vh auto;
    font-size: 1.8vw;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.der-word {
    font-size: 2vw;
    font-weight: bold;
    margin-bottom: 0.5vh;
    cursor: pointer;
}

.der-pos,
.der-def,
.der-example {
    font-size: 1.8vw;
    /* cursor: pointer; */
}

.der-def,
.der-example {
    margin-top: 0.5vh;
    cursor: pointer;
    text-transform: var(--cap);
}

/* 容器样式 */
.container {
    perspective: 1000px;
    width: 80%;
    height: 65vh;
    margin: 4vh 15vh;
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
