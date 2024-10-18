<script setup>
import Top from './Top.vue'
import Bannner from './Bannner.vue'
import Desks from './Desks.vue'
import Bottom from './Bottom.vue'

//数据库初始化
const request = window.indexedDB.open('FlashCard', 2); // 指定数据库版本
// 处理数据库打开失败
request.onerror = function () {
    console.log('数据库打开失败');
};
request.onsuccess = function (event) {
    const db = event.target.result;
    console.log(db)
    // const transaction = db.transaction(['desks'], 'readwrite');
    // const objectStore = transaction.objectStore('desks');

    // // 清空数据库
    // const clearRequest = objectStore.clear();

    // clearRequest.onsuccess = function () {
    //     console.log('数据库清空成功');
    // };
    // const transaction = db.transaction(['desks'], 'readonly');
    // const objectStore = transaction.objectStore('desks');

    // // 使用游标遍历所有记录
    // const cursorRequest = objectStore.openCursor();

    // cursorRequest.onsuccess = function (event) {
    //     const cursor = event.target.result;
    //     if (cursor) {
    //         console.log('Record key:', cursor.primaryKey);  // 获取主键
    //         console.log('Record value:', cursor.value);  // 获取记录值
    //         cursor.continue();
    //     } else {
    //         console.log('遍历完毕');
    //     }
    // };

    // cursorRequest.onerror = function () {
    //     console.log('Cursor traversal failed');
    // };

};
// 处理数据库升级（当版本号提升时触发）
request.onupgradeneeded = function (event) {
    const db = event.target.result;

    // 创建 "desks" 对象仓库，用于存储每个 desk 的信息
    if (!db.objectStoreNames.contains('desks')) {
        const deskStore = db.createObjectStore('desks', { keyPath: 'id', autoIncrement: true }); // 使用 'id' 作为主键，并自动递增
        deskStore.createIndex('name', 'name', { unique: true }); // desk 名称索引
        deskStore.createIndex('createdAt', 'createdAt', { unique: false }); // 创建时间索引
        deskStore.createIndex('description', 'description', { unique: false }); // 描述索引
    }

    // 如果不存在对象仓库 "cards"，则创建
    if (!db.objectStoreNames.contains('cards')) {
        const cardStore = db.createObjectStore('cards', { keyPath: 'id', autoIncrement: true }); // 使用 'id' 作为主键，并自动递增为单词
        cardStore.createIndex('word', 'word', { unique: true }); // 单词唯一索引
        cardStore.createIndex('phonetic', 'phonetic', { unique: false }); // 音标
        cardStore.createIndex('mean', 'mean', { unique: false }); // 释义
        cardStore.createIndex('derivation', 'derivation', { unique: false }); // 派生词
        cardStore.createIndex('nextReviewTime', 'nextReviewTime', { unique: false }); // 下次复习时间
        cardStore.createIndex('reviewCount', 'reviewCount', { unique: false }); // 复习次数
        cardStore.createIndex('deskId', 'deskId', { unique: false }); // 关联到 desk 的 deskId
    }

    console.log('数据库创建或升级成功');
};

</script>
<template>
    <div class="wrapper"></div>
    <Top />
    <Bannner />
    <div class="main">
        <!-- 渲染 desks 列表 -->
        <Desks />
    </div>
    <Bottom />
</template>
<style>
.main {
    width: 90%;
    padding-top: 0.5vh;
    padding-bottom: max(10vh, 50px);
    margin: 2vh auto;
    background-color: var(--main);
}
</style>