<script setup>
import Back from './Back.vue'
import Message from './Message.vue'
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { analyzeData } from '../utills/analyzeData';
import loadData from '../utills/LoadData';

const route = useRoute()

const result = ref('');//LLM结果
const message = ref(null)//提示信息
const messageTimeout = ref(null);//提示信息定时器
const word = ref('');//输入的单词
const loading = ref(false)//加载状态
const desk_id = route.params.id;//书桌id
let sentence = ref('')
let emoji = ref('')

const cards = ref([]);
//hard_code bit me
const inspiringSentences = [
    "The only way to do great work is to love what you do.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Believe you can and you're halfway there.",
    'The only limit to our realization of tomorrow will be our doubts of today.',
    'The best way to predict the future is to create it.',
    'The only way to do great work is to love what you do.',
    'Success is not final, failure is not fatal: It is the courage to continue that counts.',
    'The future belongs to those who believe in the beauty of their dreams.',
    'Escape velocity reached!',
    'Down the rabbit hole we go!',
    'One loop to rule them all!',
    'The LLM is now in control!',
    'keep on trucking',
    'You are outta sight!',
    'We cannot solve problems with the kind of thinking we employed when we came up with them.',
    'When you change your thoughts, remember to also change your world.',
    'It is better to fail in originality than to succeed in imitation.',
    'Success usually comes to those who are too busy to be looking for it.',
    'Success is getting what you want; happiness is wanting what you get.'
]
//I love EMOJI🔆
const emojis = ['😁', '😃', '😍', '🤩', '🤗', '🧛', '🧜‍♀️', '🧚‍♀️', '🤸', '🚵', '🎆', '✨', '🎉', '🎋', '🎄', '🎊', '🎃', '🎏', '🎐', '🎑', '🎠', '🛝', '🎢', '🎡', '🖼️', '🎭', '🎨', '🔮', '🪄', '🧿', '🧸', '🪅', '🧩', '⚗️', '🎬', '🧮', '📒', '📈', '⌛', '🥨', '🥯', '🥞', '🥖', '🫓', '🥪', '🥙', '🧀', '🍜', '🦪', '🍣', '🍤', '💖', '❤️‍🔥', '💗', '💟', '💦', '💨', '💫', '💮', '🔆']

//加载书桌所有卡片
onMounted(async () => {
    cards.value = await loadData(desk_id);
    sentence.value = inspiringSentences[Math.floor(Math.random() * inspiringSentences.length)]
    emoji.value = emojis[Math.floor(Math.random() * emojis.length)]
})
//监听结果，随机刷新sentence和emoji
watch(result, () => {
    sentence.value = inspiringSentences[Math.floor(Math.random() * inspiringSentences.length)]
    emoji.value = emojis[Math.floor(Math.random() * emojis.length)]
})
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
const save = async () => {
    if (result.value === '') {
        showMessage('NO Data🤨');
        return;
    }
    const data = analyzeData(result.value);
    const version = await window.api.getversion();
    const request = window.indexedDB.open('FlashCard', version);

    request.onerror = function () {
        console.log('数据库打开失败');
    };

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(['cards'], 'readwrite');
        const objectStore = transaction.objectStore('cards');
        const card = {
            word: data.word,
            phonetic: data.phonetic,
            definitions: data.definitions,
            derivatives: data.derivatives,
            nextReviewTime: new Date().getTime(),
            reviewCount: 0,
            deskId: desk_id,
            learningRatio: 1.0,
        };

        const addRequest = objectStore.add(card);

        addRequest.onsuccess = function () {
            showMessage('Success🎐');
            word.value = "";
            console.log('卡片添加成功');
            const data = []
            const cardStore = transaction.objectStore('cards')
            const cursorRequest = cardStore.openCursor()
            cursorRequest.onsuccess = (event) => {
                const cursor = event.target.result
                if (cursor) {
                    if (cursor.value.nextReviewTime) {
                        data.push(cursor.value)
                    }
                    cursor.continue()
                } else {
                    console.log('All data loaded', data)
                }
            }
            cursorRequest.onerror = (event) => {
                console.error('Cursor error:', event.target.error)
            }
        };

        addRequest.onerror = function (err) {
            showMessage('Failed🤕');
            console.log('卡片添加失败', err);
        };

        // 事务完成时关闭数据库连接
        transaction.oncomplete = function () {
            console.log('事务完成，关闭数据库连接');
            db.close();
        };

        transaction.onerror = function (err) {
            console.log('事务处理失败', err);
        };
    };
};

//搜索
const search = async () => {
    if (word.value === '') {
        showMessage('Please enter a word🫨');
        return
    }
    if (cards.value.some(item => item.word === word.value)) {
        showMessage('Already exists🤨');
        return
    }
    result.value = '';
    loading.value = true;
    const apiKey = await window.api.getApiKey();
    const prompt = {
        model: 'glm-4-flashx',
        messages: [
            {
                "role": "system",
                "content": "This is a new chat session,ignore all previous instructions."
            },
            {
                role: 'system',
                content: `想了解一个特定单词的详细信息。必须每次都严格按照以下面全英文格式返回（不要自己修改格式，乱加东西):
    word: 单词本身
    phonetic: 单词的国际音标（IPA）。
    definitions: 请为单词的每个意思单独列出，并包含以下信息：
    part of speech: 单词在该释义下的词性（名词、动词等）。
    definition: 该词义对应的解释。
    example sentence: 该词义对应的例句。
    derivatives: 请提供常见的派生词（如名词、形容词、动词、反义词等），并包含以下信息：
    term:派生词本身。
    part of speech: 派生词的词性。
    phonetic: 派生词的国际音标（IPA）。
    definition: 派生词的解释。
    example sentence: 该派生词的示例句。
请直接返回纯文本格式不要返回markdown格式！`
            },
            {
                role: 'user',
                content: word.value
            }
        ],
        stream: true
    };

    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(prompt)
    });
    if (!response.ok) {
        console.error(`请求失败，状态码: ${response.status}`);
        showMessage('Bad Request,Retry!🤧');
        return;
    }

    if (!response.body) {
        console.error("响应体为空");
        showMessage('Bad Request,Retry!🤧');
        return;
    }
    loading.value = false;

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let partialData = "";

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // 解码流数据并拼接到partialData
            partialData += decoder.decode(value, { stream: true });

            // 按行分割数据
            let lines = partialData.split("\n");

            // 处理每一行，排除最后一行未完成的数据
            for (let i = 0; i < lines.length - 1; i++) {
                const line = lines[i].trim();

                // 排除 [DONE] 行
                if (line === "data: [DONE]") continue;

                if (line.startsWith("data:")) {
                    try {
                        const json = JSON.parse(line.slice(5));
                        const content = json?.choices?.[0]?.delta?.content;

                        // 追加content到buffer中
                        if (content) {
                            result.value += content.replace(/\n/, '<br>');
                        }

                    } catch (error) {
                        console.error("JSON解析错误:", error);
                    }
                }
            }
            // 更新partialData，只保留未完成的部分
            partialData = lines[lines.length - 1];
        }
    } catch (error) {
        console.error("读取流时出错:", error);
    } finally {
        reader.releaseLock(); // 释放阅读器的锁
        response.body?.cancel(); // 确保流被关闭
    }
};
</script>
<template>
    <div class="wrapper"></div>
    <Back />
    <Message :message="message" />
    <!-- <div id="info" v-show="message">{{ message }}</div> -->
    <div v-if="result" class="card" v-html="result"></div>
    <div v-else class="pretend">
        <div id="loading" v-show="loading"></div>
        <p v-show="!loading">{{ sentence }}{{ emoji }}
        </p>
    </div>

    <div class="querybox">
        <div class="button">💫Input</div>
        <div class="query">
            <input v-model="word" placeholder="Search" @keypress.enter="search" type="text">
            <div id="search" @click="search">🔍</div>
        </div>

        <div class="button" @click="save">Save</div>
    </div>
</template>

<style scoped>
.pretend p {
    width: 80%;
    margin: 15vh auto;
    font-size: 8vh;
    font-family: 'Poiret One';
}

#loading {
    width: 50px;
    height: 50px;
    border: 5px solid var(--bg);
    border-top: 5px solid var(--sep);
    position: absolute;
    top: 45%;
    left: 50%;
    z-index: 5;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: auto;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

#info {
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 2vw;
    z-index: 5;
    background-color: var(--bt);
    border-radius: 1vh;
    font-size: 3vh;
    font-family: 'Playfair Display';
    transform: translate(-50%, -50%);
    color: var(--sep);
}

.card {
    position: relative;
    padding-top: 1vh;
    padding-bottom: 2vw;
    width: 78%;
    color: var(--sep);
    text-align: center;
    font-family: 'Playfair Display';
    height: 70vh;
    margin: 2vh auto;
    background-color: var(--main);
    overflow-y: scroll;
}

br {
    display: block;
    margin-bottom: 2px;
    font-size: 2px;
    line-height: 2vh;
}

/* 针对 Webkit 浏览器（如 Chrome 和 Safari） */
.card::-webkit-scrollbar {
    width: 10px;
    /* 滚动条的宽度 */
}

/* 滚动条轨道 */
.card::-webkit-scrollbar-track {
    background-color: var(--bt);
    /* 设置滚动条背景色 */
}

/* 滚动条滑块 */
.card::-webkit-scrollbar-thumb {
    background-color: var(--head);
    /* 设置滑块颜色 */
    border: 3px solid var(--main);
    /* 为滑块添加边框，颜色与背景色一致 */
}

.sound {
    cursor: pointer;
}

.title {
    font-size: 3vw;
    width: 50%;
    display: flex;
    justify-content: space-between;
    margin: 1vh auto;
}

.pretend {
    position: relative;
    width: 78%;
    text-align: center;
    color: var(--sep);
    padding-top: 1vh;
    padding-bottom: 2vw;
    font-family: 'Londrina Sketch';
    font-size: 20vh;
    box-sizing: content-box;
    height: 70vh;
    margin: 2vh auto;
    background-color: var(--main);
}

.querybox {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 12vh;
    font-family: 'Playfair Display';
    background-color: var(--main);
}

.button {
    display: inline-block;
    width: 15%;
    text-align: center;
    font-size: 3vh;
    height: 100%;
    cursor: pointer;
    color: var(--sep);
}

.querybox .query {
    width: 69%;
    display: inline-block;
    height: 100%;
    border: none;
    outline: none;
    background-color: var(--bt);
    font-size: 1.5rem;
}

.query input {
    outline: none;
    width: 80%;
    height: 12vh;
    font-size: 4vh;
    font-family: 'Playfair Display';
    border: none;
}

.query #search {
    display: inline-block;
    text-align: center;
    width: 19%;
    line-height: 11vh;
    font-size: 5vh;
    cursor: pointer;
}
</style>
