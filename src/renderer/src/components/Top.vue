<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { store } from '../store';
import router from '../router';
const lastCompletedDate = computed(() => store.state.lastCompletedDate)
const streak = computed(() => store.state.streak)
const date = ref(new Date())
const now_time = ref(date.value.toString().split(' ')[4])
const today = new Date().toISOString().slice(0, 10)// 格式化为 "YYYY/MM/DD"
const completed = computed(() => store.dispatch('checkCompleted'))

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
            <span v-if="completed === true">🎉</span>
            <span v-else>🔎</span>
            <span>{{ streak }} day</span>
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
