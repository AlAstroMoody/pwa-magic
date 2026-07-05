<script setup lang="ts">
import { useApiGuard, useToast } from '@/shared/composables'
import { iActions, iApiFeature, iButton } from '@/shared/ui'
import {
  getDisplayMedia,
  getSupportedConstraints,
  getUserMedia,
  showError,
  togglePictureInPicture,
} from '@/shared/utils'
import { enumerateDevices } from '@/shared/utils/mediaCapture'
import { onUnmounted, ref, useTemplateRef } from 'vue'

const toast = useToast()
const isSupported = ref(!!navigator.mediaDevices)
const { meta, isSecureContext, requiresSecureContext, guard } = useApiGuard(
  'MediaCapture',
  isSupported,
)

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
  if (!guard()) return
  const result = await enumerateDevices()
  if (result.devices) {
    devicesList.value = result.devices
    toast.info(JSON.stringify(result.devices))
  } else if (result.error) {
    toast.error(result.error)
  }
}

const handleGetSupportedConstraints = () => {
  if (!guard()) return
  constraints.value = getSupportedConstraints()
  toast.info(JSON.stringify(constraints.value))
}

const handleGetUserMedia = async () => {
  if (!guard()) return
  try {
    stopCurrentStream()
    const stream = await getUserMedia(video.value)
    currentStream.value = stream
  } catch (error) {
    toast.error(`Ошибка захвата камеры: ${showError(error)}`)
  }
}

const handleGetDisplayMedia = async () => {
  if (!guard()) return
  try {
    stopCurrentStream()
    const stream = await getDisplayMedia(video.value)
    currentStream.value = stream
  } catch (error) {
    toast.error(`Ошибка захвата экрана: ${showError(error)}`)
  }
}

onUnmounted(() => {
  stopCurrentStream()
})
</script>

<template>
  <iApiFeature
    :is-supported="isSupported"
    :is-secure-context="isSecureContext"
    :requires-secure-context="requiresSecureContext"
    :api-name="meta.title"
  >
    <iActions>
      <iButton @click="handleEnumerateDevices">Получить список доступных устройств</iButton>
      <iButton @click="handleGetSupportedConstraints">Получить список требований к потоку</iButton>
      <iButton @click="handleGetUserMedia">Захват камеры</iButton>
      <iButton @click="handleGetDisplayMedia">Захват экрана</iButton>
      <iButton @click="togglePictureInPicture(video)">Toggle Picture-in-Picture</iButton>
    </iActions>
    <video ref="video" width="320" height="240" class="media-capture__video" autoplay />
  </iApiFeature>
</template>

<style>
.media-capture__video:not([srcObject]) {
  background: green;
  margin: auto;
}
</style>
