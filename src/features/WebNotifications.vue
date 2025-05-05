<script setup lang="ts">
import { iButton } from '@/shared/ui'
import { ref } from 'vue'

const isSupported = ref('Notification' in window)
const permission = ref<NotificationPermission>(Notification.permission)

async function requestPermission(): Promise<void> {
  if (!isSupported.value) {
    alert('Notifications API не поддерживается.')
    return
  }
  try {
    permission.value = await Notification.requestPermission()
  } catch (error) {
    alert('Ошибка при запросе разрешения на уведомления.')
  }
}

function showNotification(): void {
  if (!isSupported.value || permission.value !== 'granted') {
    alert('Уведомления не разрешены или не поддерживаются.')
    return
  }
  new Notification('Ня!', {
    body: 'Это тестовое уведомление.',
    icon: '/pwa-magic/favicons/favicon-32x32.png',
  })
}
</script>

<template>
  <div v-if="!isSupported">Notifications API не поддерживается</div>
  <div class="api-content__wrapper">
    <iButton @click="requestPermission" :disabled="permission === 'granted'">
      Запросить разрешение
    </iButton>
    <iButton @click="showNotification" :disabled="permission !== 'granted'">
      Показать уведомление
    </iButton>
  </div>
</template>
