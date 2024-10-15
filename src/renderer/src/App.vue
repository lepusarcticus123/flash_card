<script setup>
import { ref } from 'vue';
import Desk from './components/Desk.vue';
import Bottom from './components/Bottom.vue';
const className = ref('default')
const changeTheme = () => {
  if (className.value === 'jianbian1') {
    className.value = 'jianbian2'
  } else if (className.value === 'jianbian1') {
    className.value = 'jianbian2'
  } else if (className.value === 'jianbian2') {
    className.value = 'jianbian3'
  }
}
</script>

<template>
  <div :class="className"> <!-- 修正 class 绑定 -->
    <div class="box"></div>
    <!-- <button @click="changeTheme">点击我</button>
       -->
    <Desk v-for="i in 10" :key="i" /> <!-- 添加 key 避免渲染警告 -->
    <Bottom />

  </div>
</template>

<style>
.jianbian1 {
  --background: url(./assets/liutijianbian1.jpg);
}

.jianbian2 {
  --background: url(./assets/liutijianbian2.jpg);
}

.jianbian3 {
  --background: url(./assets/liutijianbian3.jpg);
}

.default {
  --background: url(../assets/liutijianbian1.jpg);
}

.box {
  background-image: var(--background);
  background-size: cover;
  position: fixed;
  height: 100vh;
  width: 100vw;
}
</style>
