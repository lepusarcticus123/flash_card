<script setup>
import { ref } from 'vue';
const ThemeName = ref('default');
</script>

<template>
  <div :class="ThemeName"> <!-- 修正 class 绑定 -->
    <router-view></router-view>
  </div>
</template>
<style>
.default {
  --bg: #f9f7f7;
  --head: #3f72af;
  --main: #dbe2ef;
  --font: white;
  --sep: #112d4e;
  --bt: white;
  --desk: rgba(17, 45, 78, 0.5);
}

.dark {
  --bg: #616161;
  --head: #212121;
  --main: #d5d5d5;
  --font: white
}

.blue {
  --bg: #03A9F4;
  --head: #0288D1;
  --main: #FFFFFF;
  --font: white
}

.wrapper {
  background-color: var(--bg);
  position: fixed;
  height: 100vh;
  width: 100vw;
  z-index: -1;
}
</style>
