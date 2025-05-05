<script setup lang="ts">
import { iButton } from '@/shared/ui'
import { ref } from 'vue'

const isSupported = ref('vibrate' in navigator)
const isSecureContext = ref(
  window.location.protocol === 'https:' || window.location.hostname === 'localhost',
)

function vibrateSimple(): void {
  checkPermissions()
  const success = navigator.vibrate(200)
  if (!success) {
    alert('Вибрация не выполнена. Проверьте настройки устройства или режим.')
  }
}

function vibratePattern(): void {
  checkPermissions()
  const pattern = [100, 50, 100, 50, 100]
  const success = navigator.vibrate(pattern)
  if (!success) {
    alert('Вибрация не выполнена. Проверьте настройки устройства или режим.')
  }
}

function checkPermissions() {
  if (!isSupported.value) {
    alert('Vibration API не поддерживается.')
    return
  }
  if (!isSecureContext.value) {
    alert('Для работы Vibration API требуется HTTPS или localhost.')
    return
  }
}
</script>

<template>
  <div v-if="!isSecureContext">Для работы Vibration API требуется HTTPS или localhost</div>
  <div v-else-if="!isSupported">Vibration API не поддерживается</div>
  <div class="api-content__wrapper">
    <iButton @click="vibrateSimple" :disabled="!isSupported || !isSecureContext">
      Простая вибрация
    </iButton>
    <iButton @click="vibratePattern" :disabled="!isSupported || !isSecureContext">
      Шаблон вибрации
    </iButton>
  </div>
</template>
