<script setup lang="ts">
import { useApiGuard, useToast } from '@/shared/composables'
import { iActions, iApiFeature, iButton } from '@/shared/ui'
import { ref } from 'vue'

const toast = useToast()
const isSupported = ref('contacts' in navigator && 'ContactsManager' in window)
const { meta, isSecureContext, requiresSecureContext, guard } = useApiGuard(
  'ContactPicker',
  isSupported,
)

interface Contact {
  name: string[]
  tel: string[]
  email: string[]
}

interface ContactsManager {
  getProperties: () => Promise<string[]>
  select: (properties: string[], options?: { multiple?: boolean }) => Promise<Contact[]>
}

const selectedContacts = ref<Contact[] | null>(null)
const supportedProperties = ref<string[] | null>(null)

async function checkPropertiesSupport(): Promise<void> {
  if (!guard()) return

  try {
    const contactsManager = navigator.contacts as unknown as ContactsManager
    const properties = await contactsManager.getProperties()
    supportedProperties.value = properties
    toast.info(`Поддерживаемые свойства: ${properties.join(', ')}`)
  } catch (error) {
    toast.error(error)
  }
}

async function handleSelectContacts(): Promise<void> {
  if (!guard()) return

  try {
    const contacts = await navigator.contacts.select(['name', 'tel', 'email'], { multiple: true })
    if (contacts.length === 0) {
      toast.info('Контакты не выбраны.')
      return
    }
    selectedContacts.value = contacts
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
      <iButton @click="checkPropertiesSupport">Проверить поддерживаемые свойства</iButton>
      <iButton @click="handleSelectContacts">Выбрать контакты</iButton>
    </iActions>
    <div v-if="supportedProperties">
      <h3>Поддерживаемые свойства:</h3>
      <ul>
        <li v-for="prop in supportedProperties" :key="prop">{{ prop }}</li>
      </ul>
    </div>
    <div v-if="selectedContacts">
      <h3>Выбранные контакты:</h3>
      <ul>
        <li v-for="(contact, index) in selectedContacts" :key="index">
          <strong>Имя:</strong> {{ contact.name.join(', ') || 'Не указано' }}<br />
          <strong>Телефон:</strong> {{ contact.tel.join(', ') || 'Не указано' }}<br />
          <strong>Email:</strong> {{ contact.email.join(', ') || 'Не указано' }}
        </li>
      </ul>
    </div>
  </iApiFeature>
</template>
