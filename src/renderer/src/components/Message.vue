<template>
    <div id="info" v-show="message">{{ message }}</div>
</template>
<script setup>
const props = defineProps(['message'])
</script>
<style>
#info {
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 2vw;
    z-index: 10;
    border: 1px solid var(--sep);
    background-color: var(--bt);
    border-radius: 1vh;
    font-size: 3vh;
    font-family: 'Playfair Display';
    transform: translate(-50%, -50%);
    color: var(--sep);
}
</style>