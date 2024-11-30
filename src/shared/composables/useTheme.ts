import { onMounted, ref, watch } from 'vue'

export function useTheme() {
  const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
  const theme = ref<string>(localStorage.getItem('theme') || preferredTheme)

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  onMounted(() => {
    document.documentElement.setAttribute('data-theme', theme.value)
  })

  watch(theme, (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  })

  return {
    theme,
    toggleTheme,
  }
}
