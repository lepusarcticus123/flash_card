<script setup>
import { ref, onMounted } from 'vue'

const videoRef = ref(null)

const openCamera = () => {

    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        if (videoRef.value) {
            videoRef.value.srcObject = stream
        }
    })
}
const captureButton = ref(null)
const image = ref(null)
const capture = () => {
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.value.videoWidth
    canvas.height = videoRef.value.videoHeight
    canvas.getContext('2d').drawImage(videoRef.value, 0, 0, canvas.width, canvas.height)
    const dataURL = canvas.toDataURL()
    image.value.src = dataURL
    new Notification('image captured', { body: "image captured" })
}

</script>

<template>
    <button @click="openCamera">Open Camera</button>
    <video ref="videoRef" autoplay width="600" height="600"></video>
    <img ref="image" id="img">
    <button ref="captureButton" @click="capture">Capture</button>
</template>
