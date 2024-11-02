<script setup>
import Bannner from './Bannner.vue'
import Desks from './Desks.vue'
import Bottom from './Bottom.vue'
// indexedDB.deleteDatabase('FlashCard');  // 删除数据库，用于测试
</script>
<template>
    <div class="wrapper"></div>
    <Bannner />
    <div class="main">
        <Desks />
    </div>
    <Bottom />
</template>
<style>
.wrapper {
    background-color: var(--bg);
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    z-index: -1;
}

.main {
    width: 90%;
    padding-top: 0.5vh;
    padding-bottom: max(10vh, 50px);
    margin: 2vh auto;
    background-color: var(--main);
}
</style>