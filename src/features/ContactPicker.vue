<script setup lang="ts">
const supported = 'contacts' in navigator && 'ContactsManager' in window
interface ContactsManager {
  getProperties: () => Promise<ContactProperty[]>
}

enum ContactProperty {
  'address' = 'address',
  'email' = 'email',
  'icon' = 'icon',
  'name' = 'name',
  'tel' = 'tel',
}

async function checkPropertiesSupport(): Promise<void> {
  try {
    const supportedProperties = await navigator.contacts.getProperties()
    alert(supportedProperties)
  } catch {
    alert("This browser doesn't support the Contact Picker API")
  }
}
</script>
<template>
  <div>
    <button @click="checkPropertiesSupport">Click</button>
  </div>
</template>
