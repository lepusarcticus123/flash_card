<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
<template>
    <div class="wrapper"></div>
    <div class="congratulations">
        <p id="text">CONGRATULATIONS!</p>
        <div id="back" @click="router.push('/')">Back to Home</div>
    </div>
</template>
<style scoped>
.congratulations {
    background-image: url('../../../../resources/congra.png');
    background-size: cover;
    width: 100vw;
    height: 80vh;
    margin: 0 auto;
    position: relative;
    font-family: 'Poiret One';

}

#back {
    width: 70%;
    height: 15vh;
    background-color: var(--main);
    text-align: center;
    line-height: 15vh;
    font-size: 5vw;
    font-weight: bold;
    position: absolute;
    bottom: 0;
    border-radius: 5vh;
    left: 50%;
    color: var(--bt);
    transition: all 0.3s ease-in-out;
    transform: translate(-50%, 0%);
}

#back:hover {
    cursor: pointer;
    background-color: var(--bt);
    color: var(--sep);
}

#text {
    position: absolute;
    animation: down 0.5s ease-in-out forwards;
    ;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 7vw;
    color: var(--sep);
}

@keyframes down {
    0% {
        top: 10%;
    }

    60% {
        top: 70%;
    }

    80% {
        top: 60%;
    }

    100% {
        top: 65%;
    }
}
</style>
