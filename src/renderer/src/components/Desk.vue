<script setup>
import Study from './Study.vue';
import CardDisplay from './CardDisplay.vue';
import Back from './Back.vue';
import { useRoute } from 'vue-router';
import { store } from '../store';
import router from '../router';

import loadData from '../utills/LoadData';
import { ref, onMounted } from 'vue';
const route = useRoute()
let data = ref([])
onMounted(async () => {
    try {
        data.value = await loadData(route.params.id);
    }
    catch (error) {
        console.log("loadCards error", error)
    }
})
const desk = store.state.desks.find((desk) => desk.id == route.params.id)
const add = () => {
    router.push(`/desk/${route.params.id}/add`)
}
const handleUpdateData = (id) => {
    data.value = data.value.filter(card => card.id !== id);
};
</script>
<template>
    <Back />
    <div class="add box" @click="add">Add</div>
    <Study :desk="desk" :data="data"></Study>
    <CardDisplay v-if="data.length > 0" :id="desk.id" :data="data" @updateData="handleUpdateData">
    </CardDisplay>
    <div v-else class="tip" @click="add">ADD SOME CARDS🤗</div>
</template>
<style scoped>
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