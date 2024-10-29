<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { analyzeData } from '../utills/analyzeData';
import { store } from '../store';
const level = computed(() => store.state.level)
const route = useRoute()
const router = useRouter()
const result = ref('');
const word = ref('');
const convertedHTML = computed(() => md.render(result.value));
const id = route.params.id;

const back = () => {
    router.go(-1)
}

const save = async () => {
    const data = analyzeData(result.value);
    const version = await window.api.getversion()
    const request = window.indexedDB.open('FlashCard', version)

    request.onerror = function () {
        console.log('数据库打开失败')
    }

    request.onsuccess = function (event) {
        const db = event.target.result
        const transaction = db.transaction(['desks'], 'readwrite')
        const objectStore = transaction.objectStore('desks')

        const date = new Date()
        const formattedDate = `M:${date.getMonth() + 1} D:${date.getDate()}`

        // 添加新的 desk 数据
        const addRequest = objectStore.add({ name: deskName, createdAt: formattedDate })

        addRequest.onsuccess = function (event) {
            const deskId = event.target.result // 获取生成的 deskID
            console.log('deskId:', deskId)
            console.log('添加 desk 成功')

            // 成功后，将新 desk 提交给 Vuex 的 state，包括 deskId
            commit('addDesk', { id: deskId, name: deskName, createdAt: formattedDate })
        }

        addRequest.onerror = function () {
            console.log('添加 desk 失败')
        }
    }

    console.log(data);
}
const search = async () => {
    result.value = '';
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

    word.value = "";

    if (!response.ok) {
        console.error(`请求失败，状态码: ${response.status}`);
        return;
    }

    if (!response.body) {
        console.error("响应体为空");
        return;
    }

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
const play = async () => {
    // const msg = new SpeechSynthesisUtterance(word.value);
    // window.speechSynthesis.speak(msg);
    // responsiveVoice.speak(word.value);
    try {
        const audioData = await window.api.getaudio();
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
    <button @click="play">读</button>
    <div class="back box" @click="back">
        <div>Back</div>
    </div>
    <div v-if="result" class="card" v-html="result"></div>
    <div v-else class="pretend">
        Let's Give It A Try!

    </div>

    <div class="querybox">
        <div class="button" @click="search">Retry</div>
        <div class="query"><input v-model="word" placeholder="Search" tofocus type="text">
            <div id="search" @click="search">🔍</div>
        </div>

        <div class="button" @click="save">Save</div>
    </div>
</template>

<style scoped>
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
