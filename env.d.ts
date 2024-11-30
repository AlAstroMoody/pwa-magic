/// <reference types="vite/client" />
interface ContactInfo {
  address: Array<ContactAddress>
  email: Array<string>
  icon: Blob
  name: Array<string>
  tel: Array<string>
}

interface Navigator {
  share?: (data?: ShareData) => Promise<void>
  contacts: {
    getProperties: () => Promise<void>
    requestPermission: () => Promise<string>
    select: (
      properties: ContactProperty[],
      options?: ContactsSelectOptions,
    ) => Promise<ContactInfo[]>
  }
}

interface Window {
  showOpenFilePicker?: () => Promise<[fileHandle]>
  showSaveFilePicker?: () => Promise<{
    createWritable: () => Promise<{
      write: (file: File | String) => Promise<void>
      close: () => Promise<void>
    }>
  }>
}
