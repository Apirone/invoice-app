import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';
import Button from '@/components/buttons/Button.vue';
import Copy from '@/components/buttons/Copy.vue';
import Loader from '@/components/Loader.vue';
import VueQRCodeComponent from 'vue-qr-generator';

Vue.component('w-btn', Button);
Vue.component('w-copy', Copy);
Vue.component('qr-code', VueQRCodeComponent);
Vue.component('w-loader', Loader);

Vue.prototype.Axios = axios;

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
