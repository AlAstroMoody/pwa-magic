<script setup lang="ts">
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
  }
}

const isShared = !!navigator.share
</script>

<template>
  <div>
    <div v-if="!isShared" class="error">Не поддерживается на устройстве</div>
    <button @click="share" v-else>click</button>
  </div>
</template>

<style>
.error {
  color: red;
}
</style>
