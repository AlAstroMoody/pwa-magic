<script setup lang="ts">
import { useApiGuard, useToast } from '@/shared/composables'
import { iActions, iApiFeature, iButton } from '@/shared/ui'
import { ref } from 'vue'

const toast = useToast()
const isSupported = ref(!!navigator.share)
const { meta, isSecureContext, requiresSecureContext, guard } = useApiGuard('WebShare', isSupported)

function share() {
  if (!guard() || !navigator.share) return

  navigator
    .share({
      title: 'Radio',
      text: 'Amazing radio',
      url: 'https://alastromoody.github.io/radio/',
    })
    .then(() => toast.success('Удалось поделиться'))
    .catch((error) => toast.error(error))
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
      <iButton @click="share">click</iButton>
    </iActions>
  </iApiFeature>
</template>
