<script setup lang="ts">
import { useToast } from '@/shared/composables'

const { toasts, dismiss } = useToast()
</script>

<template>
  <div class="toast-container" aria-live="polite">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="`toast--${toast.type}`"
        role="alert"
      >
        <span class="toast__message">{{ toast.message }}</span>
        <button class="toast__close" type="button" aria-label="Закрыть" @click="dismiss(toast.id)">
          ×
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style>
.toast-container {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: min(360px, calc(100vw - 32px));
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-background-soft);
  color: var(--color-text);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  pointer-events: auto;
}

.toast--error {
  border-color: #c0392b;
}

.toast--success {
  border-color: hsla(160, 100%, 37%, 1);
}

.toast__message {
  flex: 1;
  font-size: 0.9rem;
  line-height: 1.4;
  word-break: break-word;
}

.toast__close {
  flex-shrink: 0;
  border: none;
  background: transparent;
  color: inherit;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  opacity: 0.6;
  padding: 0;
}

.toast__close:hover {
  opacity: 1;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(16px);
}

.toast-move {
  transition: transform 0.25s ease;
}
</style>
