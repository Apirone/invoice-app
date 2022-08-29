<template>
  <div :class="['invoice', {loading}, {'invoice-expired': status.title === 'Expired'}]">
    <div class="invoice__body">
      <div class="invoice__info">
        <div class="qr__wrapper">
          <div class="skeleton__box">
            <qr-code :text="data.qr" v-if="!loading" />
          </div>
        </div>
        <div class="info">
          <div v-if="data['user-data'] && typeof data['user-data'] === 'object'">
            <h1 v-if="data['user-data'].data">{{ data['user-data'].data }}</h1>
            <h1 v-else>
              Invoice <small v-if="data.invoice">({{ data.invoice }})</small>
            </h1>
            <p class="merchant" v-if="data['user-data'].merchant">
              By
              <a v-if="data['user-data'].url" :href="data['user-data'].url" target="_blank" rel="noopener noreferrer"
                class="link hovered">{{ data['user-data'].merchant }}</a>
              <span v-else>{{ data['user-data'].merchant }}</span>
            </p>
          </div>
          <h1 v-else>
            Invoice <small v-if="data.invoice">({{ data.invoice }})</small>
          </h1>
          <p class="skeleton__box info__date"><span>{{ data.created }}</span></p>
          <p class="skeleton__box info__amount"><span>{{ data.amount }}</span></p>
          <p class="info__price"
            v-if="data['user-data'] && typeof data['user-data'] === 'object' && data['user-data'].price">{{
            `${data['user-data'].price.amount} ${data['user-data'].price.currency}` }}</p>
        </div>
      </div>
      <div class="address">
        <div class="address__title">Payment address</div>
        <p class="skeleton__box">{{ data.address }}</p>
        <w-copy :text="data.address" v-if="!loading" />
      </div>
      <div class="status-data__wrapper">
        <div :class="['status-data', {historyFlag}]">
          <div :class="['status', {skeleton__box: status.title !== 'Warning'}, `${status.title.toLowerCase()}`]">
            <div class="status__icon">
              <span v-if="status.title !== 'Loading'">
                <component :is="`${status.title}Icon`" />
              </span>
            </div>
            <div class="status__text">
              <p>{{ status.description }}</p>
              <p v-if="expire && status.title !== 'Success'" class="countdown">{{ expire }}</p>
            </div>
          </div>
          <div class="history" v-if="data.history">
            <ul>
              <li class="history__item" v-for="item, id in data.history" :key="id">
                <span>
                  {{ (new Date(`${item.date}+00:00`)).toLocaleString() }}
                  <span v-if="item.amount">({{ (item.amount * factor).toFixed(8) }})</span>
                </span>
                <span>{{ item.status }}</span>
              </li>
            </ul>
          </div>
          <w-btn @click="historyFlag = !historyFlag" class="toggler">
            <ArrowIcon />
          </w-btn>
        </div>
      </div>
      <p v-if="linkbackCounter" class="countdown" style="text-align: center;">
        Get back to the site in {{ linkbackCounter }} seconds or click <a :href="linkback" class="link hovered">here</a>
      </p>
    </div>
    <div class="invoice__footer">
      <p>
        Powered by
        <a href="https://apirone.com/" title="Apirone" class="link hovered">
          <Logo />
        </a>
      </p>
    </div>
  </div>
</template>

<script>
import Logo from '@/components/icons/Logo.vue';
import SuccessIcon from '@/components/icons/SuccessIcon.vue';
import RefreshIcon from '@/components/icons/RefreshIcon.vue';
import WarningIcon from '@/components/icons/WarningIcon.vue';
import ExpiredIcon from '@/components/icons/ExpiredIcon.vue';
import ArrowIcon from '@/components/icons/ArrowIcon.vue';

export default {
  components: {
    Logo,
    SuccessIcon,
    RefreshIcon,
    WarningIcon,
    ExpiredIcon,
    ArrowIcon,
  },
  data() {
    return {
      loading: true,
      serviceUrl: window?.configs?.SERVICE_URL || 'https://apirone.com',
      id: '',
      currencies: Object,
      status: {
        title: 'Loading',
        description: '',
      },
      data: Object,
      expire: null,
      historyFlag: false,
      linkbackCounter: null,
      linkback: null,
      factor: null,
    };
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    this.id = urlParams.get('id');
    if (this.id) {
      this.Axios.options(`${this.serviceUrl}/api/v2/wallets`)
      .then((response) => {
        this.currencies = response.data.currencies;
        this.repeat();
      })
      .catch(() => {
        this.newStatus('Warning', 'Something went wrong');
      });
    } else {
      this.newStatus('Warning', 'Invalid invoice id');
    }
  },
  methods: {
    newStatus(title, description) {
      this.status = {
        title,
        description,
      }
    },
    repeat() {
      this.getData().then((response) => {
        if (response) {
          const update = setInterval(() => {
            this.getData().then((repeatFlag) => {
              if (!repeatFlag) {
                clearInterval(update);
              }
            });
          }, 5000);
        }
      });
    },
    async getData() {
      if (this.status.title !== 'Expired') {
        await this.Axios.get(`${this.serviceUrl}/api/v2/invoices/${this.id}`)
        .then((response) => {
          response.data.created = (new Date(`${response.data.created}+00:00`)).toLocaleString();
          this.currencies.forEach(currency => {
            if (currency.abbr === response.data.currency) {
              this.factor = parseFloat(currency['units-factor']);
              const walletPrefix = `${currency.name.toLowerCase().replace(/[()]/g, '').split(' ').join('-')}:`;
              const amount = response.data.amount ? {
                value: (response.data.amount * parseFloat(currency['units-factor'])).toFixed(8),
                isNumber: true,
              } : {
                value: '',
                isNumber: false,
              };
              response.data.qr = `${walletPrefix}${response.data.address}${amount.isNumber ? '?amount=' + amount.value : ''}`;
              response.data.amount = `${amount.value} ${amount.isNumber ? response.data.currency.toUpperCase() : ''}`;
            }
          });
          if (response.data.expire) {
            this.countdown(response.data.expire);
          }
          const {status} = response.data;
          if (status === 'created' || status === 'partpaid') {
            this.newStatus('Refresh', 'Waiting for payment');
          } else if (status === 'expired') {
            this.newStatus('Expired', 'Expired');
          } else {
            this.newStatus('Success', 'Payment accepted');
            if (response.data.linkback && !this.loading) {
              this.linkback = response.data.linkback;
              this.linkbackCounter = 15;
              setInterval(() => {
                this.linkbackCounter -= 1;
                if (this.linkbackCounter <= 0) {
                  this.linkbackCounter = null;
                  document.location.href = response.data.linkback;
                }
              }, 1000);
            }
          }
          this.data = response.data;
          this.loading = false;
        })
        .catch(() => {
          this.newStatus('Warning', 'Not Found');
        });
        if (this.data.status === 'created' || this.data.status === 'partpaid') {
          return true;
        }
      }
      return false;
    },
    countdown(expire) {
      const interval = setInterval(() => {
        const countDownDate = new Date(`${expire}+00:00`).getTime();
        const now = new Date().getTime();
        const distance = countDownDate - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        this.expire = (days > 0 ? `${days}d `: ' ')
                    + (hours > 0 ? `${hours}h `: ' ')
                    + (minutes > 0 ? `${minutes}m `: ' ')
                    + `${seconds}s`;
        if (distance < 0) {
          clearInterval(interval);
          this.expire = null;
          if (this.status.title !== 'Success') {
            this.newStatus('Expired', 'Expired');
          }
        }
      }, 1000);
    },
  },
}
</script>

<style scoped>
.link {
  transition: .3s;
  color: #5d8ab9;
}

.invoice {
  width: 95%;
  max-width: 35rem;
  margin: 2rem 0;
}

.invoice-expired {
  opacity: .6;
}

.invoice h1 {
  margin: 0;
}

.invoice h1 small {
  font-size: 50%;
  opacity: .6;
}

.merchant {
  margin-top: 0;
}

.info__date {
  color: #a5a5a5;
  margin: 0;
}

.info__amount {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0;
}

.info__amount small {
  opacity: .7;
}

.info__price {
  margin-top: .5rem;
}

.invoice__body {
  margin-top: 1rem;
}

.invoice__info {
  display: flex;
}

.info {
  margin-left: 2rem;
  flex-grow: 1;
}

.qr__wrapper {
  width: 10rem;
  height: 10rem;
  border: .0625rem solid #f1f1f1;
  padding: 1rem;
  border-radius: 1rem;
  overflow: hidden;
  align-self: center;
}

.qr__wrapper>div {
  width: 100%;
  height: 100%;
}

.address {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  width: 100%;
  min-height: 4rem;
  margin: 1rem 0;
  padding: 0 1rem;
  border: 1px solid#f1f1f1;
  border-radius: 1rem;
}

.address p {
  word-wrap: break-word;
  max-width: 87%;
}

.address__title {
  position: absolute;
  top: -.8rem;
  left: .7rem;
  padding: .3rem;
  font-size: .8rem;
  background-color: #ffffff;
  color: #a5a5a5;
}

.status-data__wrapper {
  position: relative;
  min-height: 8rem;
  width: 100%;
  z-index: 9;
}

.status-data {
  margin: 1rem 0;
  position: absolute;
  width: 100%;
}

.history {
  height: 0;
  overflow-y: hidden;
  padding-top: 1rem;
  transition: .4s;
  transform: translateY(-1.75rem);
}

.status-data.historyFlag .history {
  height: unset;
  transform: translateY(-.75rem);
  border: 1px solid #f1f1f1;
  border-top: none;
  border-radius: 0 0 1rem 1rem;
}

.status-data.historyFlag .history ul {
  padding: 0 1rem 1rem;
  margin-bottom: 0;
  background-color: #ffffff;
}

.history__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
}

.status {
  display: flex;
  align-items: center;
  position: relative;
  background-color: #f1f1f1;
  border-radius: 1rem;
  padding-right: 1rem;
}

.status__icon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4rem;
  width: 4rem;
  margin-right: 2rem;
  border-radius: 1rem;
  background-color: #f1f1f1;
}

.status__text {
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
}

.status__icon span {
  width: 2rem;
  height: 2rem;
}

.status.refresh .status__icon {
  background-color: #5d8ab9;
}

.status.success .status__icon {
  background-color: #30cb83;
}

.status.expired .status__icon {
  background-color: #a5a5a5;
}

.status.warning .status__icon {
  background-color: #f39c12;
}

.status__icon {
  color: #ffffff;
}

.status.refresh .svg {
  -webkit-animation: spin 2s linear infinite;
  -moz-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}

.invoice__footer {
  color: #a5a5a5;
}

.invoice__footer p {
  text-align: center;
}

.invoice__footer .logo {
  width: 5rem;
  transform: translateY(2px);
}

.loading .skeleton__box {
  position: relative;
  overflow: hidden;
  background-color:#f1f1f1;
  border-radius: 1rem;
  color: rgba(0, 0, 0, 0);
}

.loading p.skeleton__box {
  width: 100%;
  height: 2rem;
}

.loading .skeleton__box>span {
  opacity: 0;
}

.loading .skeleton__box::after {
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
  90deg,
  rgba(255, 255, 255, 0) 0,
  rgba(255, 255, 255, 0.2) 20%,
  rgba(255, 255, 255, 0.5) 60%,
  rgba(255, 255, 255, 0)
  );
  animation: shimmer 2s infinite;
  content: '';
}

table {
  box-sizing: border-box;
  text-indent: initial;
  border-spacing: 2px;
  border-color: grey;
  border-collapse: collapse;
  display: table;
  overflow-x: auto;
  width: 100%;
}

thead {
  display: table-header-group;
  vertical-align: middle;
  border-color: inherit;
}

tr {
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
  border-top: 1px solid rgb(223, 226, 229);
}

td, th {
  border-width: 1px;
  border-style: solid;
  border-color: rgb(223, 226, 229);
  border-image: initial;
  padding: 0.6em 1em;
  text-align: left;
}

th {
  display: table-cell;
  vertical-align: inherit;
  font-weight: bold;
}

.invoice__footer {
  color: #a5a5a5;
}

.invoice__footer p {
  text-align: center;
}

.countdown {
  font-weight: bold;
}

@-moz-keyframes spin { 
  100% { -moz-transform: rotate(-360deg); } 
}

@-webkit-keyframes spin { 
  100% { -webkit-transform: rotate(-360deg); } 
}

@keyframes spin { 
  100% { 
    -webkit-transform: rotate(-360deg); 
    transform: rotate(-360deg); 
  } 
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

@media screen and (max-width: 540px) {
  .invoice__info {
    flex-direction: column;
  }

  .info {
    order: -1;
    margin-left: 0;
  }
}

@media screen and (max-width: 400px) {
  .status__icon {
    margin-right: 1rem;
  }
}
</style>

<style>
.qr__wrapper img {
  width: 100%;
  height: 100%;
}

.qr__wrapper canvas {
  max-width: 100%;
}

.invoice__footer .logo {
  width: 5rem;
  transform: translateY(2px);
}

.btn__copy {
  margin-left: 2rem;
}

.status__icon .svg {
  width: 100%;
  height: 100%;
}

.loading .toggler {
  display: none !important;
}

body .status-data .toggler {
  position: absolute;
  top: 100%;
  right: 1rem;
  margin-top: -1rem;
  border-radius: 0 0 0.3rem 0.3rem;
  border-color: #f1f1f1;
  background-color: #f1f1f1;
  padding: 0 0.5rem;
}

body .status-data.historyFlag .toggler {
  margin-top: -.75rem;
}

body .status-data .toggler .btn__icon {
  transform: rotate(180deg);
}

body .status-data.historyFlag .toggler .btn__icon {
  transform: rotate(0deg);
}
</style>
