<script setup lang="ts">
import { useTheme } from '@/shared/composables'
import { iThemeButton } from '@/shared/ui'
import { onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const { theme, toggleTheme } = useTheme()

const menu = [
  { title: 'Web API', link: '/' },
  { title: 'Зачем?', link: '/about' },
]

onMounted(() => {
  const loader = document.querySelector('.loader') as HTMLElement
  if (loader) loader.style.display = 'none'
})
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink :to="item.link" v-for="item in menu" :key="item.title">
          {{ item.title }}
        </RouterLink>
      </nav>
      <iThemeButton @click="toggleTheme">{{ theme }}</iThemeButton>
    </div>
  </header>

  <RouterView />
</template>

<style>
@import './main.css';

header {
  line-height: 1.5;
  max-height: 100vh;
  font-family: Blackcraft;
  padding-bottom: 1rem;
  margin-bottom: 0.5rem;
  border-bottom: var(--color-border) 1px solid;
}

header .wrapper {
  display: flex;
  place-items: flex-start;
  justify-content: space-between;
  width: 100%;
}

nav {
  display: flex;
  width: 100%;
  text-align: center;
  font-size: 1rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  border-left: 1px solid var(--color-border);
  white-space: nowrap;
  padding: 0 1rem;
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  nav {
    text-align: left;
    font-size: 1rem;
    padding-bottom: 1rem;
  }
}
</style>
