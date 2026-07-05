<script setup lang="ts">
import { useApiGuard, useToast } from '@/shared/composables'
import { iActions, iApiFeature, iButton } from '@/shared/ui'
import { onMounted, onUnmounted, ref } from 'vue'

const toast = useToast()
const isSupported = ref(typeof document.documentElement.requestFullscreen === 'function')
const { meta, isSecureContext, requiresSecureContext, guard } = useApiGuard(
  'FullscreenApi',
  isSupported,
)

const demo = ref<HTMLElement | null>(null)
const isFullscreen = ref(!!document.fullscreenElement)

function updateFullscreenState() {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
  document.addEventListener('fullscreenchange', updateFullscreenState)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', updateFullscreenState)
})

async function enterFullscreen() {
  if (!guard() || !demo.value) return

  try {
    await demo.value.requestFullscreen()
  } catch (error) {
    toast.error(error)
  }
}

async function exitFullscreen() {
  if (!document.fullscreenElement) return

  try {
    await document.exitFullscreen()
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
    <div ref="demo" class="fullscreen-api__demo">
      <p>Этот блок можно развернуть на весь экран</p>
      <p v-if="isFullscreen">Сейчас в полноэкранном режиме</p>
      <iActions>
        <iButton @click="enterFullscreen" :disabled="isFullscreen">На весь экран</iButton>
        <iButton v-if="isFullscreen" @click="exitFullscreen">Выйти</iButton>
      </iActions>
    </div>
    <p class="api-note">Также можно выйти клавишей Esc</p>
  </iApiFeature>
</template>

<style>
.fullscreen-api__demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 160px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-background-soft);
  text-align: center;
}

.fullscreen-api__demo:fullscreen {
  font-size: 1.25rem;
  background: var(--color-background);
}
</style>
