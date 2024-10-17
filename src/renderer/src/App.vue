<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue';

import Desks from './components/Desks.vue';
import Bottom from './components/Bottom.vue';
import Top from './components/Top.vue';
import Bannner from './components/Bannner.vue';

const ThemeName = ref('default');

//数据库初始化
const request = window.indexedDB.open('flashcard', 2); // 指定数据库版本
// 处理数据库打开失败
request.onerror = function () {
  console.log('数据库打开失败');
};
// 处理数据库升级（当版本号提升时触发）
request.onupgradeneeded = function (event) {
  const db = event.target.result;
  // 创建 "desks" 对象仓库，用于存储每个 desk 的信息
  if (!db.objectStoreNames.contains('desks')) {
    const deskStore = db.createObjectStore('desks', { keyPath: 'name' }); // 主键为 desk 的名字
    deskStore.createIndex('name', 'name', { unique: true }); // desk 名称索引
    deskStore.createIndex('createdAt', 'createdAt', { unique: false }); // 创建时间索引
    deskStore.createIndex('description', 'description', { unique: false }); // 描述索引
  }

  // 如果不存在对象仓库 "cards"，则创建
  if (!db.objectStoreNames.contains('cards')) {
    const cardStore = db.createObjectStore('cards', { keyPath: 'word' }); // 主键为单词
    cardStore.createIndex('word', 'word', { unique: true }); // 单词唯一索引
    cardStore.createIndex('phonetic', 'phonetic', { unique: false }); // 音标
    cardStore.createIndex('mean', 'mean', { unique: false }); // 释义
    cardStore.createIndex('derivation', 'derivation', { unique: false }); // 派生词
    cardStore.createIndex('nextReviewTime', 'nextReviewTime', { unique: false }); // 下次复习时间
    cardStore.createIndex('reviewCount', 'reviewCount', { unique: false }); // 复习次数
    cardStore.createIndex('desk', 'desk', { unique: false }); // 添加 desk 字段索引，关联到 desk
  }
  console.log('数据库创建或升级成功');
};

// const upload = () => {
//   window.func.upload()
// }
</script>

<template>
  <div :class="ThemeName"> <!-- 修正 class 绑定 -->
    <!-- <button @click="upload">上传文件</button> -->
    <div class="wrapper"></div>
    <Top />
    <Bannner />

    <div class="main">
      <!-- 渲染 desks 列表 -->
      <Desks />
    </div>

    <Bottom />
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

.main {
  width: 90%;
  padding-top: 0.5vh;
  padding-bottom: max(10vh, 50px);
  margin: 2vh auto;
  background-color: var(--main);
}
</style>
