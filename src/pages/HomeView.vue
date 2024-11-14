<script setup lang="ts">
import apiList from '@/static/APIDescription.json'
</script>

<template>
  <main>
    <div>
      <RouterLink :to="`api/${item.key}`" v-for="item in apiList" :key="item.title" class="link">
        {{ item.title }}
      </RouterLink>
    </div>
  </main>
</template>

<style>
.link {
  padding: 20px;
  display: block;
  width: fit-content;
}
</style>
