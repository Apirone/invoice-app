import { createApp } from 'vue';
import App from './App.vue';
import axios from 'axios';
import Button from '@/components/buttons/Button.vue';
import Copy from '@/components/buttons/Copy.vue';
import Loader from '@/components/Loader.vue';
import VueQRCodeComponent from 'vue-qr-generator';

const app = createApp(App);

app.config.globalProperties.Axios = axios;

app.component('w-btn', Button);
app.component('w-copy', Copy);
app.component('qr-code', VueQRCodeComponent);
app.component('w-loader', Loader);

app.mount('#app')
