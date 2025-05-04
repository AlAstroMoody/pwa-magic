<script setup lang="ts">
import { iButton } from '@/shared/ui'
import { showError } from '@/shared/utils'
import { ref } from 'vue'

interface Contact {
  name: string[]
  tel: string[]
  email: string[]
}

interface ContactsManager {
  getProperties: () => Promise<string[]>
  select: (properties: string[], options?: { multiple?: boolean }) => Promise<Contact[]>
}

const isSupported = ref('contacts' in navigator)
const isSecureContext = ref(
  window.location.protocol === 'https:' || window.location.hostname === 'localhost',
)
const selectedContacts = ref<Contact[] | null>(null)
const supportedProperties = ref<string[] | null>(null)

async function checkPermissions(): Promise<boolean> {
  if (!isSupported.value) return false
  try {
    const permissionStatus = await navigator.permissions.query({
      name: 'contacts' as PermissionName,
    })
    return permissionStatus.state === 'granted' || permissionStatus.state === 'prompt'
  } catch (error) {
    return false
  }
}

async function checkPropertiesSupport(): Promise<void> {
  if (!isSupported.value) {
    alert('Contacts API не поддерживается этим браузером.')
    return
  }
  if (!isSecureContext.value) {
    alert('Для работы Contacts API требуется HTTPS или localhost.')
    return
  }
  if (!(await checkPermissions())) {
    alert('Доступ к контактам не разрешён.')
    return
  }
  try {
    const contactsManager = navigator.contacts as unknown as ContactsManager
    const properties = await contactsManager.getProperties()
    supportedProperties.value = properties
    alert(`Поддерживаемые свойства: ${properties.join(', ')}`)
  } catch (error) {
    alert(`Ошибка: ${showError(error)}`)
  }
}

async function handleSelectContacts(): Promise<void> {
  if (!isSupported.value) {
    alert('Contacts API не поддерживается этим браузером.')
    return
  }
  if (!isSecureContext.value) {
    alert('Для работы Contacts API требуется HTTPS или localhost.')
    return
  }
  if (!(await checkPermissions())) {
    alert('Доступ к контактам не разрешён.')
    return
  }
  try {
    const contacts = await navigator.contacts.select(['name', 'tel', 'email'], { multiple: true })
    if (!contacts.length) {
      alert('Контакты не выбраны.')
      return
    }
    selectedContacts.value = contacts
  } catch (error) {
    alert(`Ошибка: ${showError(error)}`)
  }
}
</script>

<template>
  <div v-if="!isSecureContext">Для работы Contacts API требуется HTTPS или localhost</div>
  <div v-else-if="!isSupported">Contacts API не поддерживается этим браузером</div>
  <div class="contacts-container" v-if="isSupported && isSecureContext">
    <iButton @click="checkPropertiesSupport" :disabled="!isSupported || !isSecureContext">
      Проверить поддерживаемые свойства
    </iButton>
    <iButton @click="handleSelectContacts" :disabled="!isSupported || !isSecureContext">
      Выбрать контакты
    </iButton>
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
  </div>
</template>

<style>
.contacts-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
}
</style>
