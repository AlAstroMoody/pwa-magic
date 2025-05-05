<script setup lang="ts">
import { iButton } from '@/shared/ui'
import {
  getDisplayMedia,
  getSupportedConstraints,
  getUserMedia,
  showError,
  togglePictureInPicture,
} from '@/shared/utils'
import { enumerateDevices } from '@/shared/utils/mediaCapture'
import { onUnmounted, ref, useTemplateRef } from 'vue'

const video = useTemplateRef<HTMLVideoElement>('video')
const devicesList = ref<MediaDeviceInfo[] | null>(null)
const constraints = ref<MediaTrackSupportedConstraints | null>(null)
const currentStream = ref<MediaStream | null>(null)

const stopCurrentStream = () => {
  if (currentStream.value) {
    currentStream.value.getTracks().forEach((track) => track.stop())
    currentStream.value = null
    if (video.value) {
      video.value.srcObject = null
    }
  }
}

const handleEnumerateDevices = async () => {
  const result = await enumerateDevices()
  if (result.devices) {
    devicesList.value = result.devices
    alert(JSON.stringify(result.devices))
  } else if (result.error) {
    alert(`Ошибка: ${showError(result.error)}`)
  }
}

const handleGetSupportedConstraints = () => {
  constraints.value = getSupportedConstraints()
  alert(JSON.stringify(constraints.value))
}

const handleGetUserMedia = async () => {
  try {
    stopCurrentStream()
    const stream = await getUserMedia(video.value)
    currentStream.value = stream
  } catch (error) {
    alert(`Ошибка захвата камеры: ${showError(error)}`)
  }
}

const handleGetDisplayMedia = async () => {
  try {
    stopCurrentStream()
    const stream = await getDisplayMedia(video.value)
    currentStream.value = stream
  } catch (error) {
    alert(`Ошибка захвата экрана: ${showError(error)}`)
  }
}

onUnmounted(() => {
  stopCurrentStream()
})
</script>

<template>
  <div class="api-content__wrapper">
    <iButton @click="handleEnumerateDevices">Получить список доступных устройств</iButton>
    <iButton @click="handleGetSupportedConstraints">Получить список требований к потоку</iButton>
    <iButton @click="handleGetUserMedia">Захват камеры</iButton>
    <iButton @click="handleGetDisplayMedia">Захват экрана</iButton>
    <iButton @click="togglePictureInPicture(video)">Toggle Picture-in-Picture</iButton>
    <video ref="video" width="320" height="240" class="media-capture__video" autoplay />
  </div>
</template>

<style>
.media-capture__video:not([srcObject]) {
  background: green;
  margin: auto;
}
</style>
