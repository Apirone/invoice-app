import { createApp } from 'vue';
import App from './App.vue';
import axios from 'axios';
import Button from '@/components/buttons/Button.vue';
import Copy from '@/components/buttons/Copy.vue';
import Loader from '@/components/Loader.vue';
import VueQRCodeComponent from 'vue-qr-generator';
import { createI18n } from 'vue-i18n/index';
import locales from './lang/locales'

const messages = locales;

const i18n = createI18n({
  locale: navigator.language.split('-')[0] || process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages,
})

const app = createApp(App);

app.config.globalProperties.Axios = axios;

app.use(i18n);

app.component('w-btn', Button);
app.component('w-copy', Copy);
app.component('qr-code', VueQRCodeComponent);
app.component('w-loader', Loader);

app.mount('#app');
