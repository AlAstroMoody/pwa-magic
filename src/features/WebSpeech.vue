<script setup lang="ts">
import { useApiGuard, useToast } from '@/shared/composables'
import { iActions, iApiFeature, iButton } from '@/shared/ui'
import { ref } from 'vue'

const toast = useToast()
const isSupported = ref('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
const { meta, isSecureContext, requiresSecureContext, guard } = useApiGuard('WebSpeech', isSupported)

const transcript = ref<string | null>(null)
const isRecognizing = ref(false)
const permissionStatus = ref<PermissionState | null>(null)
const recognitionInstance = ref<SpeechRecognition | null>(null)

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

async function checkMicrophonePermission(): Promise<boolean> {
  try {
    const result = await navigator.permissions.query({ name: 'microphone' as PermissionName })
    permissionStatus.value = result.state
    return result.state === 'granted' || result.state === 'prompt'
  } catch {
    return false
  }
}

async function startRecognition(): Promise<void> {
  if (!guard()) return
  if (!(await checkMicrophonePermission())) {
    toast.info('Доступ к микрофону не разрешён. Проверьте настройки браузера.')
    return
  }

  try {
    const recognition = new SpeechRecognition()
    recognitionInstance.value = recognition
    recognition.lang = 'ru-RU'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onresult = function (event: SpeechRecognitionEvent) {
      if (event.results && event.results.length > 0 && event.results[0].length > 0) {
        transcript.value = event.results[0][0].transcript
      } else {
        transcript.value = 'Результаты не получены.'
      }
      isRecognizing.value = false
    }

    recognition.onerror = function (event: SpeechRecognitionErrorEvent) {
      let message = 'Неизвестная ошибка'
      switch (event.error) {
        case 'no-speech':
          message = 'Речь не обнаружена.'
          break
        case 'aborted':
          message = 'Распознавание прервано.'
          break
        case 'audio-capture':
          message = 'Микрофон недоступен.'
          break
        case 'not-allowed':
          message = 'Доступ к микрофону запрещён.'
          break
        case 'network':
          message = 'Ошибка сети.'
          break
        default:
          message = `Ошибка: ${event.error}`
      }
      toast.info(message)
      isRecognizing.value = false
      recognitionInstance.value = null
    }

    recognition.onend = function () {
      isRecognizing.value = false
      recognitionInstance.value = null
    }

    recognition.start()
    isRecognizing.value = true
  } catch (error) {
    toast.error(error)
  }
}

function stopRecognition(): void {
  if (isRecognizing.value && recognitionInstance.value) {
    try {
      recognitionInstance.value.stop()
      isRecognizing.value = false
      recognitionInstance.value = null
    } catch (error) {
      toast.error(error)
    }
  }
}

function speakText(): void {
  if (!('speechSynthesis' in window)) {
    toast.info('Speech Synthesis не поддерживается.')
    return
  }
  if (!guard()) return

  try {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(
      transcript.value ||
        "I've seen things... seen things you little people wouldn't believe. Attack ships on fire off the shoulder of Orion bright as magnesium... I rode on the back decks of a blinker and watched C-beams glitter in the dark near the Tannhäuser Gate. All those moments... they'll be gone",
    )
    utterance.lang = 'ru-RU'
    window.speechSynthesis.speak(utterance)
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
    <iActions>
      <iButton @click="startRecognition" :disabled="isRecognizing">
        {{ isRecognizing ? 'Распознавание...' : 'Начать распознавание' }}
      </iButton>
      <iButton @click="stopRecognition" :disabled="!isRecognizing">
        Остановить распознавание
      </iButton>
      <iButton @click="speakText">Озвучить текст</iButton>
    </iActions>
    <p v-if="transcript">Распознанный текст: {{ transcript }}</p>
    <p v-if="permissionStatus">Статус разрешения микрофона: {{ permissionStatus }}</p>
  </iApiFeature>
</template>
