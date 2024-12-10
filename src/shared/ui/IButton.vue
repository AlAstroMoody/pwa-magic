<template>
  <button class="button"><slot /></button>
</template>
<style>
.button {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  width: fit-content;
  color: var(--color-background);
  background-color: var(--color-text);
  transition: 450ms;
}
.button:active {
  transition: all 0.25s;
  -webkit-transition: all 0.25s;
  box-shadow: none;
  transform: scale(0.9);
}
</style>
