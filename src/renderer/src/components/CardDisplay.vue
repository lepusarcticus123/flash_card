<script setup>
import { defineProps } from 'vue';
const props = defineProps(['id', 'data'])
//删除
const remove = async (id) => {
    const version = await window.func.getversion();
    const request = window.indexedDB.open('FlashCard', version);

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['cards'], 'readwrite');
        const objectStore = transaction.objectStore('cards');

        const deleteRequest = objectStore.delete(id);

        deleteRequest.onsuccess = () => {
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
</script>
<template>
    <div class="container">
        <div class="cards" v-for="i in 5">
            <div>
                <p id="word">Lepus</p>
                <p id="meaning">lepus is hshfhsfnskfhshfiuahsfhnsjhk</p>
            </div>

            <div id="delete" @click="remove(i)">Delete</div>
        </div>

    </div>
</template>
<style scoped>
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