/// <reference types="vite/client" />

interface Navigator {
  share?: (data?: ShareData) => Promise<void>
  contacts: { getProperties: () => Promise<void> }
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
