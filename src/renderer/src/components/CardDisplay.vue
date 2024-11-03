<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import router from '../router';

const props = defineProps(['id', 'data'])
const emit = defineEmits(['updateData']);

const word = ref('')
const route = useRoute()
//分批加载卡片
const pile = ref(10)

onMounted(() => {
    //检测滚动到底部
    window.addEventListener('scroll', () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            pile.value += 10;
        }
    });
})

//删除卡片
const remove = async (id) => {
    const version = await window.api.getversion();
    const request = window.indexedDB.open('FlashCard', version);

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['cards'], 'readwrite');
        const objectStore = transaction.objectStore('cards');

        const deleteRequest = objectStore.delete(id);

        deleteRequest.onsuccess = () => {
            emit('updateData', id);
            console.log(`Card with id ${id} deleted successfully.`);
        };

        deleteRequest.onerror = (event) => {
            console.error(`Error deleting card with id ${id}:`, event.target.error);
        };
    };

    request.onerror = (event) => {
        console.error('Database open error:', event.target.error);
    };
};

//搜索
const search = () => {
    if (props.data.some(card => card.word == word.value)) {
        router.push(`/desk/${route.params.id}/card/${word.value}`)
    } else {
        alert('Not Found')
    }
}
</script>

<template>
    <div class="container">
        <div id="total">
            <div>⚔️Total:{{ data.length }}</div>
            <div>
                <input @keypress.enter="search" type="text" v-model="word" placeholder="Search">
                <span @click="search"> 🔍 </span>
            </div>
        </div>
        <div class="cards-container">
            <div class="cards" v-for="card in data.slice(0, pile)" :key="card.id">
                <div id="content" @click="router.push(`/desk/${route.params.id}/card/${card.word}`)">
                    <p id="word">{{ card.word }}</p>
                    <p class="def" v-for="def in card.definitions">
                        - {{ def.definition }}
                    </p>
                </div>
                <div id="delete" @click="remove(card.id)">Delete</div>
            </div>
        </div>

    </div>
</template>

<style scoped>
.cards-container {
    padding-bottom: 10vh;
}

#content {
    cursor: pointer;
}

#total {
    font-size: 2vw;
    display: flex;
    justify-content: space-around;
    margin: 0.5vh 0;
    text-align: center;
    color: var(--sep);
}

#total input {
    background-color: var(--main);
    padding: 0.5vh 1vw;
    font-size: 1.8vw;
    border: none;
    border-bottom: 1px solid var(--sep);
    outline: none;
}

#total span {
    cursor: pointer;
}

#word {
    font-size: 2vw
}

.def {
    font-size: 1.5vw;
}

#delete {
    margin-right: 3vw;
    cursor: pointer;
    text-align: center;
    line-height: 5vw;
    border-radius: 5px;
    color: var(--sep);
    background-color: var(--main);
    width: 8vw;
    height: 5vw;
    transition: all 0.5s ease-in-out;
}

#delete:hover {
    background-color: var(--sep);
    color: var(--main);
}

.container {
    background-color: var(--main);
    margin: 1vh 15vh;
    padding: 1vw;
    font-family: "Playfair Display", sans-serif;
    border-radius: 6px;
}

.cards {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1px;
    margin: 1vh;
    color: var(--sep);
    background-color: var(--bg);
    border-radius: 5px;
}

.container p {
    margin: 1vw 2vw;
}
</style>
