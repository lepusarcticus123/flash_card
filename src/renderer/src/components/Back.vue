<template>
    <div class="back box" @click="back">
        <div>Back</div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
const router = useRouter()
const back = () => {
    router.go(-1)
}
</script>
<style>
.box {
    display: flex;
    font-size: 3vw;
    font-family: "Londrina Sketch", sans-serif;
    color: var(--font);
    position: absolute;
    justify-content: center;
    align-items: center;
    margin-top: 2px;
    width: 10vh;
    background-color: var(--head);
    height: 9vh;
    border-radius: 8px;
    cursor: pointer;
}

.back {
    left: 0;
    margin-left: 3vh;
}
</style>