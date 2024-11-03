<script setup>
import Study from './Study.vue';
import CardDisplay from './CardDisplay.vue';
import Back from './Back.vue';
import { useRoute } from 'vue-router';
import exportData from '../utills/exportData';
import importData from '../utills/importData';
import { store } from '../store';
import router from '../router';

import loadData from '../utills/LoadData';
import { ref, onMounted, computed } from 'vue';
const route = useRoute()

let data = ref([])
const desk_id = route.params.id
console.log("desk_id", desk_id)
//加载书桌所有卡片数据
onMounted(async () => {
    try {
        loadData(desk_id).then(res => data.value = res);
    }
    catch (error) {
        console.log("loadCards error", error)
    }
})
const desk = computed(() => store.state.desks.find((desk) => desk.id == route.params.id))
//更新数据
const handleUpdateData = (id) => {
    data.value = data.value.filter(card => card.id !== id);
};
//导出数据
const exportDesk = () => {
    exportData(desk_id)
}

const importDesk = () => {
    document.querySelector('#file').click()
}
//导入数据
const handleImport = (event) => {
    importData(event.target.files[0]).then(res => console.log(res))
}
</script>
<template>
    <div id="container">
        <Back />
        <div class="add box" @click="router.push(`/desk/${route.params.id}/add`)">Add</div>
        <Study v-if="desk" :desk="desk" :data="data"></Study>
        <CardDisplay v-if="desk && data.length > 0" :id="desk.id" :data="data" @updateData="handleUpdateData">
        </CardDisplay>
        <div v-else class="tip" @click="router.push(`/desk/${route.params.id}/add`)">ADD SOME CARDS🤗</div>
        <div class="bottom">
            <div class="button" @click="exportDesk">Export</div>
            <div class="button" @click="importDesk"><input type="file" id="file" style="display:none"
                    @change="handleImport" />Import</div>
        </div>
    </div>

</template>
<style scoped>
.button {
    cursor: pointer;
    margin: 1vh 0;
    font-weight: bold;

}

#container {
    position: relative;
}

.bottom {
    border-radius: 1vh 1vh 0 0;
    display: flex;
    background-color: var(--bt);
    justify-content: space-around;
    position: fixed;
    left: 50%;
    transform: translate(-50%, 0%);
    bottom: 0;
    height: 10vh;
    width: 75%;
    margin: 0 auto;
    text-align: center;
    line-height: 8vh;
    font-family: 'Poiret One', serif;
    color: var(--sep);
    font-size: 4vh;
}

.add {
    margin-right: 3vh;
    right: 0;
}

.tip {
    width: 75%;
    margin: 3vh auto;
    text-align: center;
    color: var(--sep);
    cursor: pointer;
    border-radius: 2vh;
    background-color: var(--main);
    padding: 3vh;
    font-family: 'Playfair Display', serif;
}
</style>