<script setup>

</script>
<template>
    <div class="desk">
        我的第一个桌面
    </div>
</template>
<style scoped>
.desk {
    width: 90%;
    height: max(14vh, 50px);
    float: left;
    margin: 1vh 5vw;
    padding: 1vh;
    border-radius: 3px;
    backdrop-filter: blur(50px);
    transition: all 0.3s ease-in-out;
}

.desk:hover {
    transform: scale(1.01);
}
</style>