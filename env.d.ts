/// <reference types="vite/client" />

interface Navigator {
  share?: (data?: ShareData) => Promise<void>
  contacts: { getProperties: () => Promise<void> }
}
