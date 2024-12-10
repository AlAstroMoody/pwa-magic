<script setup lang="ts"></script>

<template>
  <button class="theme"></button>
</template>
<style scoped>
.theme {
  position: relative;
  border-radius: 100%;
  width: 40px;
  height: 40px;
  min-width: 40px;
  background: linear-gradient(40deg, #ff0000, #ff8c00 70%);
  margin: auto;
  border: none;
  margin: -10px;
  cursor: pointer;
}

.theme::before {
  content: '';
  position: absolute;
  border-radius: 50%;
  right: -2px;
  top: -1px;
  width: 36px;
  height: 36px;
  z-index: 1;
  background: var(--color-background);
  transform: scale(0);
  transform-origin: top right;
  transition: 450ms;
  opacity: 0;
}

[data-theme='dark'] .theme {
  background: linear-gradient(40deg, #8983f7, #a3dafb 70%);
}

[data-theme='dark'] .theme::before {
  transform: scale(1);
  background: var(--color-background);
  opacity: 1;
}
</style>
