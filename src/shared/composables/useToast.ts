import { showError } from '@/shared/utils/error'
import { ref } from 'vue'

export type ToastType = 'error' | 'info' | 'success'

export interface Toast {
  id: number
  message: string
  type: ToastType
}

const toasts = ref<Toast[]>([])
let nextId = 0

const DEFAULT_DURATION = 4000

function dismiss(id: number) {
  toasts.value = toasts.value.filter((toast) => toast.id !== id)
}

function push(type: ToastType, message: string, duration = DEFAULT_DURATION) {
  const id = nextId++
  toasts.value.push({ id, message, type })
  setTimeout(() => dismiss(id), duration)
}

export function useToast() {
  function error(input: unknown) {
    if (typeof input === 'string' && input.startsWith('Ошибка')) {
      push('error', input)
      return
    }
    push('error', `Ошибка: ${showError(input)}`)
  }

  function info(input: unknown) {
    push('info', showError(input))
  }

  function success(message: string) {
    push('success', message)
  }

  return {
    toasts,
    dismiss,
    error,
    info,
    success,
  }
}
