<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

import { iDetails } from '@/shared'
import apiList from '@/static/APIDescription.json'

const route = useRoute()
const api = computed(() => apiList.find((item) => item.key === route.params.id))

const example = defineAsyncComponent(() => import(`@/features/${api.value?.key}.vue`))
</script>
<template>
  <main v-if="api">
    <h1>{{ api.title }}</h1>
    <iDetails title="Описание" :description="api.description" />
    <iDetails title="Пример">
      <template #default><component :is="example"></component></template>
    </iDetails>
  </main>
</template>
