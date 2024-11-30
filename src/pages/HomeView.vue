<script setup lang="ts">
import apiList from '@/static/APIDescription.json'
</script>

<template>
  <main class="menu">
    <RouterLink :to="`api/${item.key}`" v-for="item in apiList" :key="item.title" class="link">
      {{ item.title }}
    </RouterLink>
  </main>
</template>

<style>
.menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
}
.link {
  padding: 8px 0;
  display: block;
  width: fit-content;
}
</style>
