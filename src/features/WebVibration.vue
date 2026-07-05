<script setup lang="ts">
import { useApiGuard, useToast } from '@/shared/composables'
import { iActions, iApiFeature, iButton } from '@/shared/ui'
import { ref } from 'vue'

const toast = useToast()
const isSupported = ref('vibrate' in navigator)
const { meta, isSecureContext, requiresSecureContext, guard } = useApiGuard('WebVibration', isSupported)
const vibrationBlocked = ref(false)

function vibrateSimple(): void {
  if (!guard()) return

  try {
    const success = navigator.vibrate(200)
    if (!success) {
      vibrationBlocked.value = true
      toast.info('Вибрация заблокирована на устройстве')
    }
  } catch (error) {
    vibrationBlocked.value = true
    toast.error(error)
  }
}

function vibratePattern(): void {
  if (!guard()) return

  try {
    const pattern = [100, 50, 100, 50, 100]
    const success = navigator.vibrate(pattern)
    if (!success) {
      vibrationBlocked.value = true
      toast.info('Вибрация заблокирована на устройстве')
    }
  } catch (error) {
    vibrationBlocked.value = true
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
    <p v-if="vibrationBlocked">Вибрация недоступна (проверьте настройки)</p>
    <template v-else>
      <p>*необходимо разрешить вибрацию при касании в настройках</p>
      <iActions>
        <iButton @click="vibrateSimple">Простая вибрация (200мс)</iButton>
        <iButton @click="vibratePattern">Шаблон вибрации (3 импульса)</iButton>
      </iActions>
    </template>
  </iApiFeature>
</template>
