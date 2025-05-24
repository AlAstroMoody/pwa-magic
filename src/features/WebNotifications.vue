<script setup lang="ts">
import { iButton } from '@/shared/ui'
import { showError } from '@/shared/utils'
import { onMounted, ref } from 'vue'

const isSupported = ref(false)
const permission = ref<NotificationPermission>('default')
const isMobile = ref(false)

onMounted(() => {
  isSupported.value = 'Notification' in window
  permission.value = Notification.permission
  isMobile.value = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
})

async function requestPermission(): Promise<void> {
  if (!isSupported.value) {
    alert(
      isMobile.value
        ? 'Мобильные браузеры требуют установки PWA для уведомлений'
        : 'Notifications API не поддерживается',
    )
    return
  }

  try {
    permission.value = await Notification.requestPermission()
    if (permission.value === 'granted' && isMobile.value) {
      alert('Для мобильных уведомлений может потребоваться установка PWA')
    }
  } catch (error) {
    alert(`Ошибка: ${showError(error)}`)
  }
}

function showNotification(): void {
  if (!isSupported.value || permission.value !== 'granted') {
    alert('Уведомления не разрешены')
    return
  }

  try {
    if ('serviceWorker' in navigator && isMobile.value) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification('Ня!', {
          body: 'Это тестовое уведомление',
          icon: '/pwa-magic/favicons/favicon-32x32.png',
        })
      })
    } else {
      new Notification('Ня!', {
        body: 'Это тестовое уведомление',
        icon: '/pwa-magic/favicons/favicon-32x32.png',
      })
    }
  } catch (error) {
    alert(`Ошибка: ${showError(error)}`)
  }
}
</script>

<template>
  <div v-if="!isSupported">
    {{ isMobile ? 'Ваш мобильный браузер не поддерживает уведомления' : 'API не поддерживается' }}
  </div>
  <div v-else-if="isMobile">
    Для работы уведомлений на мобильном устройстве:
    <ul>
      <li>Установите приложение как PWA</li>
      <li>Разрешите уведомления в настройках браузера</li>
    </ul>
  </div>

  <div class="api-content__wrapper">
    <iButton @click="requestPermission" :disabled="permission === 'granted'">
      Запросить разрешение
    </iButton>
    <iButton @click="showNotification" :disabled="permission !== 'granted'">
      Показать уведомление
    </iButton>
  </div>
</template>
