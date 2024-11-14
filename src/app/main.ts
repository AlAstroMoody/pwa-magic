import { createApp } from 'vue'
import App from './App.vue'

import router from '@/app/router'

export const app = createApp(App).use(router).mount('#app')
