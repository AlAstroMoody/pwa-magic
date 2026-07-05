<script setup lang="ts">
import { useApiGuard, useToast } from '@/shared/composables'
import { iActions, iApiFeature, iButton } from '@/shared/ui'
import { onMounted, ref } from 'vue'

const toast = useToast()
const isSupported = ref(false)
const { meta, isSecureContext, requiresSecureContext, guard } = useApiGuard(
  'WebNotifications',
  isSupported,
)

const permission = ref<NotificationPermission>('default')
const isMobile = ref(false)

onMounted(() => {
  isSupported.value = 'Notification' in window
  permission.value = Notification.permission
  isMobile.value = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
})

async function requestPermission(): Promise<void> {
  if (!guard()) return

  try {
    permission.value = await Notification.requestPermission()
    if (permission.value === 'granted' && isMobile.value) {
      toast.info('Для мобильных уведомлений может потребоваться установка PWA')
    }
  } catch (error) {
    toast.error(error)
  }
}

function showNotification(): void {
  if (!guard()) return
  if (permission.value !== 'granted') {
    toast.info('Уведомления не разрешены')
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
    toast.error(error)
  }
}
</script>

<template>
  <iApiFeature
    :is-supported="isSupported"
    :is-secure-context="isSecureContext"
    :requires-secure-context="requiresSecureContext"
    :api-name="meta.title"
  >
    <div v-if="isMobile">
      Для работы уведомлений на мобильном устройстве:
      <ul>
        <li>Установите приложение как PWA</li>
        <li>Разрешите уведомления в настройках браузера</li>
      </ul>
    </div>

    <iActions>
      <iButton @click="requestPermission" :disabled="permission === 'granted'">
        Запросить разрешение
      </iButton>
      <iButton @click="showNotification" :disabled="permission !== 'granted'">
        Показать уведомление
      </iButton>
    </iActions>
  </iApiFeature>
</template>
