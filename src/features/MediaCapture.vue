<script setup lang="ts">
import { iButton } from '@/shared/ui'
import {
  getDisplayMedia,
  getSupportedConstraints,
  getUserMedia,
  togglePictureInPicture,
} from '@/shared/utils'
import { enumerateDevices } from '@/shared/utils/mediaCapture'
import { useTemplateRef } from 'vue'

const video = useTemplateRef<HTMLVideoElement>('video')
</script>
<template>
  <div class="media-capture">
    <iButton @click="enumerateDevices">Получить список доступных устройств</iButton>
    <iButton @click="getSupportedConstraints">Получить список требований к потоку</iButton>
    <iButton @click="getUserMedia(video)">Захват камеры</iButton>
    <iButton @click="togglePictureInPicture(video)">Toggle Picture-in-Picture</iButton>
    <iButton @click="getDisplayMedia(video)">Захват экрана</iButton>
    <video ref="video" width="320" height="240" class="media-capture__video" />
  </div>
</template>
<style>
.media-capture {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.media-capture__video {
  background: green;
  margin: auto;
}
</style>
