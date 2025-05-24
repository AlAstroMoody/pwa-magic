<script setup lang="ts">
import { iButton } from '@/shared/ui'
import { showError } from '@/shared/utils'
import { ref } from 'vue'

const isSupported = ref('vibrate' in navigator)
const isSecureContext = ref(
  window.location.protocol === 'https:' || window.location.hostname === 'localhost',
)
const vibrationBlocked = ref(false)

function checkPermissions(): boolean {
  if (!isSupported.value) {
    alert('Vibration API не поддерживается вашим браузером.')
    return false
  }
  if (!isSecureContext.value) {
    alert('Для работы Vibration API требуется HTTPS или localhost.')
    return false
  }
  return true
}

function vibrateSimple(): void {
  if (!checkPermissions()) return

  try {
    const success = navigator.vibrate(200)

    if (!success) {
      vibrationBlocked.value = true
      alert('Вибрация заблокирована на устройстве')
    }
  } catch (error) {
    vibrationBlocked.value = true
    alert(`Ошибка: ${showError(error)}`)
  }
}

function vibratePattern(): void {
  if (!checkPermissions()) return

  try {
    const pattern = [100, 50, 100, 50, 100]
    const success = navigator.vibrate(pattern)

    if (!success) {
      vibrationBlocked.value = true
      alert('Вибрация заблокирована на устройстве')
    }
  } catch (error) {
    vibrationBlocked.value = true
    alert(`Ошибка: ${showError(error)}`)
  }
}
</script>

<template>
  <div v-if="!isSecureContext">Для работы Vibration API требуется HTTPS или localhost</div>
  <div v-else-if="!isSupported">Vibration API не поддерживается вашим браузером</div>
  <div v-else-if="vibrationBlocked">Вибрация недоступна (проверьте настройки)</div>

  <div class="api-content__wrapper" v-else>
    *необходимо разрешить вибрацию при касании в настройках
    <iButton @click="vibrateSimple"> Простая вибрация (200мс) </iButton>
    <iButton @click="vibratePattern"> Шаблон вибрации (3 импульса) </iButton>
  </div>
</template>
