import { getApiMeta } from '@/shared/utils/apiMeta'
import { computed, ref, type ComputedRef, type Ref } from 'vue'

import { useToast } from './useToast'

type SupportedCheck = boolean | Ref<boolean> | ComputedRef<boolean>

export function useApiGuard(key: string, isSupported: SupportedCheck) {
  const meta = getApiMeta(key)
  const toast = useToast()
  const isSecureContext = ref(window.isSecureContext)
  const requiresSecureContext = meta.requiresSecureContext ?? false

  const supported = computed(() =>
    typeof isSupported === 'boolean' ? isSupported : isSupported.value,
  )

  const isReady = computed(
    () => supported.value && (!requiresSecureContext || isSecureContext.value),
  )

  function guard(): boolean {
    if (!supported.value) {
      toast.info(`${meta.title} не поддерживается.`)
      return false
    }
    if (requiresSecureContext && !isSecureContext.value) {
      toast.info(`Для работы ${meta.title} требуется HTTPS или localhost.`)
      return false
    }
    return true
  }

  return {
    meta,
    isSupported: supported,
    isSecureContext,
    requiresSecureContext,
    isReady,
    guard,
  }
}
