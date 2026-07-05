<script setup lang="ts">
defineProps({
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: String,
  disabled: Boolean,
})

const model = defineModel<string>({ required: true })
</script>

<template>
  <label class="api-label">
    <span>{{ label }}</span>
    <input
      v-model="model"
      class="api-input"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
    />
  </label>
</template>
