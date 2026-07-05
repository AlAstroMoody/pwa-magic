<script setup lang="ts">
import { useApiGuard, useToast } from '@/shared/composables'
import { iActions, iApiFeature, iButton } from '@/shared/ui'
import { ref } from 'vue'

const toast = useToast()
const isSupported = ref('geolocation' in navigator)
const { meta, isSecureContext, requiresSecureContext, guard } = useApiGuard(
  'GeolocationApi',
  isSupported,
)
const position = ref<GeolocationPosition | null>(null)

function getCurrentPosition(): void {
  if (!guard()) return

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      position.value = pos
    },
    (err) => {
      toast.error(err)
    },
    { enableHighAccuracy: true, timeout: 5000 },
  )
}
</script>

<template>
  <iApiFeature
    :is-supported="isSupported"
    :is-secure-context="isSecureContext"
    :requires-secure-context="requiresSecureContext"
    :api-name="meta.title"
  >
    <iActions>
      <iButton @click="getCurrentPosition">Получить местоположение</iButton>
    </iActions>
    <div v-if="position">
      <p>Широта: {{ position.coords.latitude }}</p>
      <p>Долгота: {{ position.coords.longitude }}</p>
      <p>Точность: {{ position.coords.accuracy }} м</p>
    </div>
  </iApiFeature>
</template>
