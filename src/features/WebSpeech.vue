<script setup lang="ts">
import { iButton } from '@/shared/ui'
import { showError } from '@/shared/utils'
import { ref } from 'vue'

const isSupported = ref('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
const isSecureContext = ref(
  window.location.protocol === 'https:' || window.location.hostname === 'localhost',
)
const transcript = ref<string | null>(null)
const isRecognizing = ref(false)
const permissionStatus = ref<PermissionState | null>(null)
const recognitionInstance = ref<SpeechRecognition | null>(null)

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

async function checkMicrophonePermission(): Promise<boolean> {
  if (!isSupported.value) return false
  try {
    const result = await navigator.permissions.query({ name: 'microphone' as PermissionName })
    permissionStatus.value = result.state
    return result.state === 'granted' || result.state === 'prompt'
  } catch {
    return false
  }
}

async function startRecognition(): Promise<void> {
  if (!isSupported.value) {
    alert('Speech Recognition не поддерживается.')
    return
  }
  if (!isSecureContext.value) {
    alert('Для работы Speech API требуется HTTPS или localhost.')
    return
  }
  if (!(await checkMicrophonePermission())) {
    alert('Доступ к микрофону не разрешён. Проверьте настройки браузера.')
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
        const result = event.results[0][0]
        transcript.value = result.transcript
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
      alert(message)
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
    alert(`Ошибка: ${showError(error)}`)
  }
}

function stopRecognition(): void {
  if (isRecognizing.value && recognitionInstance.value) {
    try {
      recognitionInstance.value.stop()
      isRecognizing.value = false
      recognitionInstance.value = null
    } catch (error) {
      alert(`Ошибка: ${showError(error)}`)
    }
  }
}

function speakText(): void {
  if (!('speechSynthesis' in window)) {
    alert('Speech Synthesis не поддерживается.')
    return
  }
  if (!isSecureContext.value) {
    alert('Для работы Speech API рекомендуется HTTPS или localhost.')
    return
  }
  try {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(
      transcript.value ||
        "I've seen things... seen things you little people wouldn't believe. Attack ships on fire off the shoulder of Orion bright as magnesium... I rode on the back decks of a blinker and watched C-beams glitter in the dark near the Tannhäuser Gate. All those moments... they'll be gone",
    )

    utterance.lang = 'ru-RU'
    window.speechSynthesis.speak(utterance)
  } catch (error) {
    alert(`Ошибка: ${showError(error)}`)
  }
}
</script>

<template>
  <div v-if="!isSecureContext">Для работы Speech API требуется HTTPS или localhost</div>
  <div v-else-if="!isSupported">Speech API не поддерживается</div>
  <div class="api-content__wrapper">
    <iButton
      @click="startRecognition"
      :disabled="isRecognizing || !isSupported || !isSecureContext"
    >
      {{ isRecognizing ? 'Распознавание...' : 'Начать распознавание' }}
    </iButton>
    <iButton @click="stopRecognition" :disabled="!isRecognizing">
      Остановить распознавание
    </iButton>
    <iButton @click="speakText" :disabled="!isSupported"> Озвучить текст </iButton>
    <p v-if="transcript">Распознанный текст: {{ transcript }}</p>
    <p v-if="permissionStatus">Статус разрешения микрофона: {{ permissionStatus }}</p>
  </div>
</template>
