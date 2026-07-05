# pwa-magic

Интерактивная PWA-песочница для изучения браузерных Web API.

Каждый API — отдельная страница с описанием и живым примером.

## Стек

- Vue 3 + TypeScript + Vite
- Vue Router
- vite-plugin-pwa

## Запуск

```bash
npm install
npm run dev
```

## Структура

```
src/
  app/       — точка входа, роутер, layout
  pages/     — Home, About, APIView
  features/  — демо-компоненты для каждого API
  shared/    — UI, composables, утилиты
  static/    — описания API (APIDescription.json)
```

Общие стили feature-компонентов: `src/app/styles/api.css`

---

## Как добавить новый API

### 1. Запись в `src/static/APIDescription.json`

`key` должен совпадать с именем файла feature (без `.vue`).

```json
{
  "key": "GeolocationApi",
  "title": "Geolocation API",
  "description": "Краткое описание для блока «Описание» на странице.",
  "requiresSecureContext": true
}
```

- `requiresSecureContext: true` — API нужен HTTPS или localhost
- `requiresSecureContext: false` — если работает и без secure context

Страница появится автоматически: `/api/GeolocationApi`

### 2. Файл feature: `src/features/GeolocationApi.vue`

Имя файла = `key` из JSON. Роутер подгружает его динамически.

### 3. Типичная структура feature (простой случай)

```vue
<script setup lang="ts">
import { useApiGuard, useToast } from '@/shared/composables'
import { iActions, iApiFeature, iButton } from '@/shared/ui'
import { ref } from 'vue'

const toast = useToast()

// Проверка поддержки API в браузере
const isSupported = ref('geolocation' in navigator)

// key — тот же, что в APIDescription.json
const { meta, isSecureContext, requiresSecureContext, guard } = useApiGuard(
  'GeolocationApi',
  isSupported,
)

// Локальное состояние демо
const result = ref<string | null>(null)

async function runDemo() {
  if (!guard()) return // toast + выход, если API недоступен

  try {
    // … вызов нативного Web API …
    result.value = 'ok'
    toast.success('Готово')
  } catch (error) {
    toast.error(error)
  }
}
</script>

<template>
  <iApiFeature
    :is-supported="isSupported"
    :is-secure-context="isSecureContext"
    :requires-secure-context="requiresSecureContext"
    :api-name="meta.title"
  >
    <iActions>
      <iButton @click="runDemo">Запустить</iButton>
    </iActions>

    <p v-if="result">{{ result }}</p>
  </iApiFeature>
</template>
```

### 4. Что использовать

| Задача | Инструмент |
|--------|------------|
| Обёртка + «не поддерживается» / «нужен HTTPS» | `iApiFeature` |
| Проверки перед вызовом API | `useApiGuard().guard()` |
| Ошибки и статус | `useToast()` → `toast.error()`, `toast.info()`, `toast.success()` |
| Кнопки | `iButton` внутри `iActions` |
| Поле ввода | `iInput v-model="…" label="…"` |
| Несколько секций в одном feature | `iChapter title="…"` |
| Стили layout (отступы, секции, input) | классы из `api.css`: `api-chapter`, `api-actions`, `api-note`… |
| Стили, специфичные для API | класс с префиксом: `my-api__video`, `my-api__result` |

### 5. Правила

- **Не использовать `scoped`** — классы либо общие (`api-*`), либо с префиксом API (`clipboard-api__image`)
- **Не дублировать проверки** — `guard()` в script, `iApiFeature` в template;
- **Сторонние npm-библиотеки** — только если нет нативного API; пометить в UI (см. BarcodeDetection + `qrcode`)
- **Скрыть с главной, но оставить в JSON** — фильтр в `HomeView.vue` (как WebOtp)

### 6. Нетипичные случаи

**Несколько независимых секций** (часть работает без API, часть нет) — без общего `iApiFeature`, отдельные `iChapter`. Пример: `BarcodeDetection.vue` (сканирование vs генерация QR).

**Нет UI-кнопок** — минимальный feature допустим, но `iApiFeature` + `guard()` всё равно желательны.

---

## Заметки

- Большинство API требуют HTTPS или localhost
- Некоторые API работают только в Chromium (Contact Picker, Barcode Detection и др.)
- Для генерации QR используется сторонняя библиотека `qrcode` — нативного Web API для этого нет

## Деплой

```bash
npm run build
npm run deploy
```

GitHub Pages: https://alastromoody.github.io/pwa-magic/
