<script setup>
import { ref } from 'vue';
const flashCards = ref(10);
</script>
<template>
    <div class="banner">
        <div class="done" v-if="flashCards == 0">Congratulations!
            <p>You Made It!</p>
        </div>
        <div class="work" v-else>We Have {{ flashCards }} Flash Cards Left Today!
            <p>Keep Up The Work!</p>
        </div>
    </div>
</template>
<style>
.banner {
    background-color: var(--main);
    width: 90%;
    margin: 0vh auto;
    padding: 2vh 0;
    border-radius: 2px;
    font-size: 6vh;
    text-align: center;
    color: var(--sep);
    font-family: "Londrina Sketch", sans-serif;
}

.banner p {
    margin: 0;
}
</style>
