<script setup lang="ts">
import { iButton } from '@/shared/ui'
import { ref } from 'vue'

const isSupported = ref('geolocation' in navigator)
const position = ref<GeolocationPosition | null>(null)
const error = ref<string | null>(null)

function getCurrentPosition(): void {
  if (!isSupported.value) {
    alert('Geolocation API не поддерживается.')
    return
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      position.value = pos
      error.value = null
    },
    (err) => {
      error.value = err.message
      alert(`Ошибка: ${err.message}`)
    },
    { enableHighAccuracy: true, timeout: 5000 },
  )
}
</script>

<template>
  <div v-if="!isSupported">Geolocation API не поддерживается</div>
  <div class="api-content__wrapper">
    <iButton @click="getCurrentPosition">Получить местоположение</iButton>
    <div v-if="position">
      <p>Широта: {{ position.coords.latitude }}</p>
      <p>Долгота: {{ position.coords.longitude }}</p>
      <p>Точность: {{ position.coords.accuracy }} м</p>
    </div>
    <p v-if="error">Ошибка: {{ error }}</p>
  </div>
</template>
