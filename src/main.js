import { createApp } from 'vue'
import App from '@/App.vue'
import { createI18n } from 'vue-i18n'
import messages from '@/lang/locales'
import { getEnv } from '@/utils/env'

const i18n = createI18n({
  locale: navigator.language.split('-')[0] || import.meta.env.VITE_I18N_LOCALE || 'en',
  fallbackLocale: import.meta.env.VITE_I18N_FALLBACK_LOCALE || 'en',
  messages,
  legacy: false,
})
const app = createApp(App)
const mountPoint = getEnv('mount_point') || '#app'
app.use(i18n)
app.mount(mountPoint)
