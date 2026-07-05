<script setup lang="ts">
import { useApiGuard, useToast } from '@/shared/composables'
import { iActions, iApiFeature, iButton, iChapter, iInput } from '@/shared/ui'
import { onUnmounted, ref } from 'vue'

const toast = useToast()
const isSupported = ref(!!navigator.clipboard)
const { meta, isSecureContext, requiresSecureContext, guard } = useApiGuard('ClipboardApi', isSupported)

const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'] as const
const canReadImages = ref(typeof navigator.clipboard?.read === 'function')
const text = ref('https://alastromoody.github.io/pwa-magic/')
const pastedText = ref<string | null>(null)
const pastedImageUrl = ref<string | null>(null)

function revokeImageUrl() {
  if (pastedImageUrl.value) {
    URL.revokeObjectURL(pastedImageUrl.value)
    pastedImageUrl.value = null
  }
}

async function copyText(): Promise<void> {
  if (!guard()) return
  if (!text.value.trim()) {
    toast.info('Введите текст для копирования.')
    return
  }

  try {
    await navigator.clipboard.writeText(text.value.trim())
    toast.success('Текст скопирован')
  } catch (error) {
    toast.error(error)
  }
}

async function readText(): Promise<void> {
  if (!guard()) return

  try {
    pastedText.value = await navigator.clipboard.readText()
    toast.success('Текст получен из буфера')
  } catch (error) {
    toast.error(error)
  }
}

function findImageType(item: ClipboardItem): string | null {
  return IMAGE_TYPES.find((type) => item.types.includes(type)) ?? null
}

async function readImage(): Promise<void> {
  if (!guard()) return
  if (!canReadImages.value) {
    toast.info('Чтение изображений из буфера не поддерживается.')
    return
  }

  try {
    const items = await navigator.clipboard.read()
    const itemWithImage = items.find((item) => findImageType(item))

    if (!itemWithImage) {
      toast.info('В буфере нет изображения. Сначала скопируйте скриншот.')
      return
    }

    const imageType = findImageType(itemWithImage)!
    const blob = await itemWithImage.getType(imageType)
    revokeImageUrl()
    pastedImageUrl.value = URL.createObjectURL(blob)
    toast.success('Изображение получено из буфера')
  } catch (error) {
    toast.error(error)
  }
}

onUnmounted(revokeImageUrl)
</script>

<template>
  <iApiFeature
    :is-supported="isSupported"
    :is-secure-context="isSecureContext"
    :requires-secure-context="requiresSecureContext"
    :api-name="meta.title"
    wrapper-class="clipboard-api"
  >
    <iChapter title="Текст">
      <iInput v-model="text" label="Текст:" />
      <iActions>
        <iButton @click="copyText">Скопировать</iButton>
        <iButton @click="readText">Вставить текст</iButton>
      </iActions>
      <p v-if="pastedText">Из буфера: {{ pastedText }}</p>
    </iChapter>

    <iChapter title="Изображение">
      <p class="api-note">
        Скопируйте скриншот в буфер (например, Win+Shift+S или Print Screen), затем нажмите кнопку
        ниже. Браузер запросит разрешение на чтение буфера.
      </p>
      <iActions>
        <iButton @click="readImage" :disabled="!canReadImages">Вставить изображение</iButton>
      </iActions>
      <img
        v-if="pastedImageUrl"
        :src="pastedImageUrl"
        alt="Изображение из буфера обмена"
        class="clipboard-api__image"
      />
    </iChapter>
  </iApiFeature>
</template>

<style>
.clipboard-api__image {
  display: block;
  max-width: 100%;
  max-height: 320px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
}
</style>
