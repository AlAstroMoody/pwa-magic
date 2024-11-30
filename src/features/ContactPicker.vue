<script setup lang="ts">
import { iButton } from '@/shared/ui'

async function checkPropertiesSupport(): Promise<void> {
  try {
    await navigator.contacts.getProperties()
  } catch {
    alert('Не поддерживается на устройстве')
  }
}

async function selectContacts() {
  const contacts = await navigator.contacts.select(['name', 'tel', 'email'], { multiple: true })
  if (!contacts.length) return
  return contacts
}
</script>
<template>
  <iButton @click="checkPropertiesSupport">Click</iButton>
</template>
