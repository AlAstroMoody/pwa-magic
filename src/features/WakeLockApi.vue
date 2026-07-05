<script setup lang="ts">
import { useApiGuard, useToast } from '@/shared/composables'
import { iActions, iApiFeature, iButton } from '@/shared/ui'
import { onUnmounted, ref } from 'vue'

const toast = useToast()
const isSupported = ref('wakeLock' in navigator)
const { meta, isSecureContext, requiresSecureContext, guard } = useApiGuard(
  'WakeLockApi',
  isSupported,
)

const isActive = ref(false)
let wakeLock: WakeLockSentinel | null = null

function onRelease() {
  isActive.value = false
  wakeLock = null
}

async function acquireWakeLock() {
  if (!guard()) return

  try {
    wakeLock = await navigator.wakeLock!.request('screen')
    isActive.value = true
    wakeLock.addEventListener('release', onRelease)
    toast.success('Экран не погаснет, пока вкладка активна')
  } catch (error) {
    toast.error(error)
  }
}

async function releaseWakeLock() {
  if (!wakeLock) return

  try {
    await wakeLock.release()
  } catch (error) {
    toast.error(error)
  }
}

onUnmounted(() => {
  wakeLock?.release()
})
</script>

<template>
  <iApiFeature
    :is-supported="isSupported"
    :is-secure-context="isSecureContext"
    :requires-secure-context="requiresSecureContext"
    :api-name="meta.title"
  >
    <p class="api-note">
      Wake Lock удерживает экран включённым. При переключении вкладки блокировка снимается
      автоматически — это поведение браузера.
    </p>

    <p>
      Статус:
      <strong>{{ isActive ? 'активен' : 'не активен' }}</strong>
    </p>

    <iActions>
      <iButton @click="acquireWakeLock" :disabled="isActive">Не гасить экран</iButton>
      <iButton @click="releaseWakeLock" :disabled="!isActive">Снять блокировку</iButton>
    </iActions>
  </iApiFeature>
</template>
