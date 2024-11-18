<script setup lang="ts">
async function checkPropertiesSupport(): Promise<void> {
  try {
    const supportedProperties = await navigator.contacts.getProperties()
    alert(`Доступные параметры: ${supportedProperties}`)
    navigator.contacts.requestPermission().then((permission) => {
      if (permission === 'granted') {
        navigator.contacts.select().then((contacts) => {
          contacts.forEach((contact) => {
            alert(`name: ${contact.name}, email: ${contact.email}, phone: ${contact.phone}`)
          })
        })
      } else {
        alert('Permission denied')
      }
    })
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
