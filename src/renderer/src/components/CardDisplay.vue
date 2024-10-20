<script setup>
import { defineProps } from 'vue';
const props = defineProps(['id'])
</script>
<template>
    <div class="container">
        <div class="cards" v-for="i in 5">
            <div>
                <p id="word">Lepus</p>
                <p id="meaning">lepus is hshfhsfnskfhshfiuahsfhnsjhk</p>
            </div>

            <div id="delete" @click="delete">Delete</div>
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
    background-color: var(--head);
    color: var(--bt);
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
    background-color: var(--bg);
    border-radius: 5px;
}

.container p {
    margin: 1vw 2vw;
}
</style>