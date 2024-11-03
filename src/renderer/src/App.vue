<script setup>
import Top from './components/Top.vue';
import { ref, computed } from 'vue';
import { store } from './store';
const ThemeName = computed(() => store.state.theme);
</script>

<template>
  <div :class="ThemeName">
    <Top />
    <div class="wrapper"></div>
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
}

.black {
  --bg: #646464;
  --head: #222831;
  --main: #aeaeae;
  --font: white;
  --sep: #fcfcfc;
  --bt: rgb(113, 113, 113);
}

.pink {
  --bg: #f5eee6;
  --head: #e6a4b4;
  --main: #f3d7ca;
  --font: white;
  --sep: #c86b85;
  --bt: rgb(255, 250, 250);
}

.capitalize {
  --cap: capitalize;
}

.non-capitalize {
  --cap: none
}
</style>
