<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
})
</script>

<template>
  <details>
    <summary>{{ title }}</summary>
    <p>
      {{ description }}
      <slot></slot>
    </p>
  </details>
</template>
<style scoped>
details {
  padding: 8px 0;
}

details summary {
  font-size: 1.3em;
  padding-right: 24px;
  width: 100%;
  position: relative;
  cursor: pointer;
  list-style: none;
  outline: 0;
  margin-right: 1em;
}

details summary::-webkit-details-marker {
  display: none;
}

details summary:after {
  content: '+';
  position: absolute;
  font-size: 2rem;
  line-height: 0;
  top: 50%;
  right: 0;
  font-weight: 200;
  transform-origin: center;
  transition: 300ms linear;
}

details[open] summary {
  margin-bottom: 1em;
}

details[open] summary:after {
  transform: rotate(45deg);
}

details[open] summary ~ * {
  animation: open 0.3s ease-in-out;
}

@keyframes open {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
