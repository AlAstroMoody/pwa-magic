<script setup lang="ts">
import { iButton } from '@/shared/ui'
import { showError } from '@/shared/utils'
import { nextTick, ref } from 'vue'

const isSupported = ref('BarcodeDetector' in window)
const detectedQRCode = ref<string | null>(null)
const isScanning = ref(false)
const videoElement = ref<HTMLVideoElement | null>(null)
const successBeep = new Audio('./success-beep.mp3')

async function scanQRCode() {
  try {
    if (!window.BarcodeDetector) {
      throw new Error('Barcode Detection API не поддерживается')
    }

    const barcodeDetector = new window.BarcodeDetector({
      formats: ['qr_code', 'ean_13', 'code_128', 'upc_a'],
    })

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
    })

    isScanning.value = true
    await nextTick()

    if (!videoElement.value) {
      throw new Error('Видеоэлемент недоступен')
    }

    videoElement.value.srcObject = stream
    await videoElement.value.play()

    const detect = async () => {
      try {
        if (!videoElement.value || videoElement.value.paused) {
          stream.getTracks().forEach((track) => track.stop())
          isScanning.value = false
          return
        }

        const barcodes = await barcodeDetector.detect(videoElement.value)
        if (barcodes.length > 0) {
          detectedQRCode.value = barcodes[0].rawValue
          await successBeep.play()
          stream.getTracks().forEach((track) => track.stop())
          isScanning.value = false
        } else {
          requestAnimationFrame(detect)
        }
      } catch (error) {
        alert(`Ошибка: ${showError(error)}`)
        stream.getTracks().forEach((track) => track.stop())
        isScanning.value = false
      }
    }

    requestAnimationFrame(detect)
  } catch (error) {
    alert(`Ошибка: ${showError(error)}`)
    isScanning.value = false
  }
}

function stopScanning() {
  if (videoElement.value?.srcObject) {
    const stream = videoElement.value.srcObject as MediaStream
    stream.getTracks().forEach((track) => track.stop())
  }
  isScanning.value = false
}
</script>

<template>
  <div v-if="!isSupported">QR-сканер не поддерживается устройством</div>
  <div v-else>
    <div>
      <iButton @click="scanQRCode" :disabled="isScanning">Сканировать QR-код</iButton>
      <iButton v-if="isScanning" @click="stopScanning">Закрыть</iButton>
    </div>
    <video v-if="isScanning" ref="videoElement" class="detection__video" />
    <div v-if="detectedQRCode" class="barcode-detection__code">
      <div>Обнаруженный QR-код:</div>
      <a :href="detectedQRCode"> {{ detectedQRCode }}</a>
    </div>
  </div>
</template>
<style>
.barcode-detection__actions {
  display: flex;
  gap: 8px;
}
.barcode-detection__video {
  width: 100%;
  max-width: 400px;
  margin: 16px 0;
}
.barcode-detection__code {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
