<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import { useRoute } from 'vue-router'

import { iDetails } from '@/shared'
import apiList from '@/static/APIDescription.json'

const route = useRoute()
const api = computed(() => apiList.find((item) => item.key === route.params.id))
const importError = ref<boolean>(false)

const example = defineAsyncComponent({
  loader: () => import(`@/features/${api.value?.key}.vue`),
  onError(error, retry, fail) {
    importError.value = true
    fail()
  },
})
</script>
<template>
  <main v-if="api && !importError">
    <h1>{{ api.title }}</h1>
    <iDetails title="Описание" :description="api.description" />
    <iDetails title="Пример">
      <template #default><component :is="example"></component></template>
    </iDetails>
  </main>
  <main v-else>В работе</main>
</template>

<style>
.api-content__wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
}
</style>
