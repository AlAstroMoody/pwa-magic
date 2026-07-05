<script setup lang="ts">
defineProps<{
  isSupported: boolean
  isSecureContext: boolean
  requiresSecureContext: boolean
  apiName: string
  wrapperClass?: string
}>()
</script>

<template>
  <div v-if="requiresSecureContext && !isSecureContext">
    Для работы {{ apiName }} требуется HTTPS или localhost
  </div>
  <div v-else-if="!isSupported">{{ apiName }} не поддерживается</div>
  <div v-else class="api-content__wrapper" :class="wrapperClass">
    <slot />
  </div>
</template>
