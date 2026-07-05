<script setup lang="ts">
import { useApiGuard, useToast } from '@/shared/composables'
import { iActions, iApiFeature, iButton, iChapter, iInput } from '@/shared/ui'
import QRCode from 'qrcode'
import { nextTick, ref } from 'vue'

const toast = useToast()
const isSupported = ref('BarcodeDetector' in window)
const { meta, isSecureContext, requiresSecureContext, guard } = useApiGuard(
  'BarcodeDetection',
  isSupported,
)

const detectedQRCode = ref<string | null>(null)
const isScanning = ref(false)
const videoElement = ref<HTMLVideoElement | null>(null)
const successBeep = new Audio('./success-beep.mp3')
const qrLink = ref('https://alastromoody.github.io/poe/')
const qrCanvas = ref<HTMLCanvasElement | null>(null)

async function scanQRCode() {
  if (!guard()) return

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
        toast.error(error)
        stream.getTracks().forEach((track) => track.stop())
        isScanning.value = false
      }
    }

    requestAnimationFrame(detect)
  } catch (error) {
    toast.error(error)
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

async function generateQR() {
  try {
    if (!qrLink.value.trim()) {
      throw new Error('Введите ссылку')
    }

    await nextTick()

    if (!qrCanvas.value) {
      throw new Error('Canvas недоступен')
    }

    await QRCode.toCanvas(qrCanvas.value, qrLink.value.trim(), {
      width: 256,
      margin: 2,
    })
  } catch (error) {
    toast.error(error)
  }
}
</script>

<template>
  <div class="barcode-detection">
    <iChapter v-if="isSupported" title="Сканирование QR-кода">
      <iActions>
        <iButton @click="scanQRCode" :disabled="isScanning">Сканировать QR-код</iButton>
        <iButton v-if="isScanning" @click="stopScanning">Закрыть</iButton>
      </iActions>
      <video v-if="isScanning" ref="videoElement" class="barcode-detection__video" />
      <div v-if="detectedQRCode" class="barcode-detection__code">
        <div>Обнаруженный QR-код:</div>
        <a :href="detectedQRCode">{{ detectedQRCode }}</a>
      </div>
    </iChapter>

    <iChapter v-else title="Сканирование QR-кода">
      <p v-if="requiresSecureContext && !isSecureContext">
        Для работы {{ meta.title }} требуется HTTPS или localhost
      </p>
      <p v-else>{{ meta.title }} не поддерживается</p>
    </iChapter>

    <iChapter title="Генерация QR-кода">
      <p class="api-note">
        *Нативного Web API для генерации QR-кода нет — используется сторонняя библиотека
        <code>qrcode</code> и Canvas API.
      </p>
      <iInput v-model="qrLink" label="Ссылка:" type="url" placeholder="https://example.com" />
      <iActions>
        <iButton @click="generateQR">Сгенерировать</iButton>
      </iActions>
      <canvas ref="qrCanvas" class="barcode-detection__qr" />
    </iChapter>
  </div>
</template>

<style>
.barcode-detection__video {
  width: 100%;
  max-width: 400px;
  margin: 16px 0;
}

.barcode-detection__qr {
  display: block;
  margin-top: 8px;
  border-radius: 8px;
}

.barcode-detection__code {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
