<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
})

const isOpen = ref(false)
</script>

<template>
  <div class="details">
    <button
      type="button"
      class="details__summary"
      :aria-expanded="isOpen"
      @click="isOpen = !isOpen"
    >
      {{ title }}
      <span class="details__icon" :class="{ 'details__icon--open': isOpen }" aria-hidden="true">+</span>
    </button>

    <div class="details__content" :class="{ 'details__content--open': isOpen }" :aria-hidden="!isOpen">
      <div class="details__inner">
        <p v-if="description" class="details__description">{{ description }}</p>
        <slot />
      </div>
    </div>
  </div>
</template>

<style>
.details {
  padding: 8px 0;
}

.details__summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  padding: 0 24px 0 0;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 1.3em;
  text-align: left;
  cursor: pointer;
  appearance: none;
  -webkit-tap-highlight-color: transparent;
}

.details__summary:focus {
  outline: none;
}

.details__summary:focus-visible {
  outline: 2px solid var(--color-border);
  outline-offset: 2px;
}

.details__summary:active {
  background: transparent;
}

.details__icon {
  flex-shrink: 0;
  font-size: 2rem;
  line-height: 0;
  font-weight: 200;
  transform-origin: center;
  transition: transform 300ms linear;
}

.details__icon--open {
  transform: rotate(45deg);
}

.details__content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.details__content--open {
  grid-template-rows: 1fr;
}

.details__inner {
  overflow: hidden;
  min-height: 0;
  padding-top: 0;
  transition: padding-top 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.details__content--open .details__inner {
  padding-top: 1em;
}

.details__description {
  margin: 0;
}

.details__inner > *:not(:first-child) {
  margin-top: 1em;
}
</style>
