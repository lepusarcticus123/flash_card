<script setup>
const props= defineProps(['data'])

</script>
<template>
    <div class="banner">
        <div class="done" v-if="data.length == 0">Congratulations!
            <p>You Made It!</p>
        </div>
        <div class="work" v-else>We Have {{ data.length }} Flash Cards Left Today!
            <p>Keep Up The Work!</p>
        </div>
    </div>
</template>
<style scoped>
.banner {
    background-color: var(--main);
    width: 90%;
    margin: 0vh auto;
    padding: 2vh 0;
    border-radius: 2px;
    font-size: 6vh;
    text-align: center;
    color: var(--sep);
    font-family: "Londrina Sketch", sans-serif;
}

.done {
    font-family: 'Poiret One';
}

.banner p {
    margin: 0;
}
</style>
