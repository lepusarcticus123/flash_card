<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import router from '../router';
const completed = ref(true)
const time = ref(1)
const date = ref(new Date())
const now_time = ref(date.value.toString().split(' ')[4])

// 定时更新时间
onMounted(() => {
    const timer = setInterval(() => {
        date.value = new Date()
        now_time.value = date.value.toString().split(' ')[4]
    }, 1000)

    onUnmounted(() => {
        clearInterval(timer)
    })
})
const edit = () => {
    router.push('/edit')
}
</script>

<template>
    <div class="head">
        <div class="day">
            <span v-if="completed">🎉</span>
            <span v-else>🔎</span>
            <span>{{ time }} day</span>
        </div>
        <div class="time">{{ now_time }}</div> <!-- 动态显示当前时间 -->
        <div class="theme" @click="edit">⚙️</div>
    </div>
</template>

<style>
.head {
    font-family: "Londrina Sketch", sans-serif;
    padding: 0 3vh;
    font-size: 4vh;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 10vh;
    background-color: var(--head);
    color: var(--font);
}

.theme {
    cursor: pointer;
}
</style>
