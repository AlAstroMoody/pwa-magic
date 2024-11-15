<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

const menu = [
  { title: 'Web API', link: '/' },
  { title: 'Зачем?', link: '/about' },
]
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink :to="item.link" v-for="item in menu" :key="item.title">
          {{ item.title }}
        </RouterLink>
      </nav>
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

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    font-size: 1rem;
    padding-bottom: 1rem;
  }
}
</style>
