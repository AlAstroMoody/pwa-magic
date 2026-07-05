<script setup lang="ts">
import { computed } from 'vue'

import apiList from '@/static/APIDescription.json'

const visibleApiList = computed(() => apiList.filter((item) => item.key !== 'WebOtp'))
</script>

<template>
  <main class="home-view__menu">
    <RouterLink
      :to="`api/${item.key}`"
      v-for="item in visibleApiList"
      :key="item.title"
      class="home-view__link"
    >
      {{ item.title }}
    </RouterLink>
  </main>
</template>
