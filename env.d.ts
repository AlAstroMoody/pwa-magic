/// <reference types="vite/client" />

interface Navigator {
  share?: (data?: ShareData) => Promise<void>
  contacts: {
    getProperties: () => Promise<void>
    requestPermission: () => Promise<string>
    select: () => Promise<{ name: string; email: string; phone: string }[]>
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
