<script setup lang="ts">
import { iButton } from '@/shared/ui'

function share() {
  if (navigator.share) {
    navigator
      .share({
        title: 'Radio',
        text: 'Amazing radio',
        url: 'https://alastromoody.github.io/radio/',
      })
      .then(() => alert('Удалось поделиться'))
      .catch((error) => alert(error))
  } else {
    alert('Не поддерживается на устройстве')
  }
}

const isShared = !!navigator.share
</script>

<template>
  <iButton @click="share">click</iButton>
</template>
