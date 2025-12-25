<template>
  <div
    :class="[
      'invoice',
      { loading },
      { 'invoice-expired': status.title === 'Expired' },
      { 'invoice__qr-only': qrOnly },
    ]"
  >
    <div v-if="!isNotFound" class="invoice__body">
      <div class="invoice__info">
        <QrCodeComponent
          :data="data"
          :loading="loading"
          :qr-only="qrOnly"
        />
        <MainInfo
          v-if="!qrOnly"
          :loading="loading"
          :data="data"
          :remains-to-pay="remainsToPay"
          :user-data="userData"
        />
      </div>
      <div v-if="!qrOnly">
        <Address
          :data="data"
          :loading="loading"
        />
        <div v-if="userData">
          <ItemsTable :data="userData"/>
        </div>
        <p
          v-if="linkbackCounter && !embed"
          class="countdown"
          style="text-align: center;"
        >
          {{ t("getBack.part1") }} {{ linkbackCounter }} {{ t("getBack.part2") }}
          <a
            :href="linkback"
            class="link hovered"
          >
            {{ t("getBack.part3") }}
          </a>
        </p>
        <StatusData
          :status="status"
          :data="data"
          :expire="expire"
          :factor="factor"
          :check-repeat="checkRepeat"
        />
        <div v-if="!loading">
          <p
            v-if="data.status === 'overpaid'"
            class="invoice__note"
          >
            You paid more than it is required.
            Please contact the seller to refund the difference
            since the seller is the only owner of this wallet and has all the funds.
          </p>
        </div>
        <Footer :embed="embed" :logo="logo"/>
      </div>
      <div v-else
           :class="['status', 'status__qr-only', { skeleton__box: status.title !== 'Warning' }, `${status.title.toLowerCase()}`]"
      >
        <p>
          <StatusIcons :status="status.title"/>
          <span v-if="status.description">{{ t(status.description) }}</span>
        </p>
      </div>
    </div>
    <div v-else class="invoice__body invoice__not-found">
      <div class="invoice__not-found-content">
        <SvgIcon name="cancel_small"/>
        <p v-if="status.description">{{ t(status.description) }}</p>
      </div>
      <Footer :embed="embed" :logo="logo"/>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

import { getEnv } from '@/utils/env'
import trimDecimalZeros from '@/utils/trimDecimalZeros'
import bigInt from "@/utils/BigIntUtils"

import useApi from '@/composables/useApi'
const { getCurrencies, getInvoiceById } = useApi()

import useCountdown from '@/composables/useCountdown'
const { expire, countdown } = useCountdown()

import useStatus from '@/composables/useStatus'
const { status, setStatus } = useStatus()

import ItemsTable from '@/components/parts/ItemsTable.vue'
import QrCodeComponent from '@/components/parts/QrCodeComponent.vue'
import MainInfo from '@/components/parts/MainInfo.vue'
import StatusData from '@/components/parts/StatusData.vue'
import Address from '@/components/parts/Address.vue'
import StatusIcons from '@/components/parts/StatusIcons.vue'
import Footer from '@/components/parts/Footer.vue'
import SvgIcon from '@/components/icons/SvgIcon.vue'

const isNotFound = ref(false)
const loading = ref(true)
const id = ref('')
const currencies = ref([])
const data = ref({})
const userData = ref({})
const embed = ref(false)
const logo = ref(false)
const qrOnly = ref(false)
const linkbackCounter = ref(null)
const linkback = ref(null)
const factor = ref(null)
const remainsToPay = ref(false)
const checkRepeat = ref(false)

let expirationConfirmed

onMounted(() => {
  const isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (isDarkTheme) {
    document.body.classList.add('dark-theme')
    document.body.classList.remove('light-theme')
  } else {
    document.body.classList.add('light-theme')
    document.body.classList.remove('dark-theme')
  }
  const urlParams = new URLSearchParams(window.location.search)

  const embedToPage = getEnv('EMBED');
  embed.value = embedToPage === true || urlParams.get('embed') === 'true'

  const displayLogo = getEnv('LOGO');
  logo.value = ['boolean','string'].includes(typeof displayLogo) ? displayLogo : !embed.value

  const displayQrOnly = getEnv('QR_ONLY')
  qrOnly.value = displayQrOnly === true || urlParams.get('qr-only') === 'true'

  id.value = urlParams.get(getEnv('INVOICE_ID_KEY') || 'id')
  if (!id.value) {
    const pathSegments = window.location.pathname.split('/')
    const pathSegmentsCount = pathSegments.length
    if (pathSegmentsCount) {
      id.value = decodeURIComponent(pathSegments[pathSegmentsCount - 1])
      if (!id.value && pathSegmentsCount > 1) {
        id.value = decodeURIComponent(pathSegments[pathSegmentsCount - 2])
      }
    }
  }
  if (!id.value) {
    isNotFound.value = true
    loading.value = false
    setStatus('Warning', 'invoiceNotFound')
    return
  }
  getCurrencies()
    .then(result => {
      currencies.value = result
      repeat()
    })
    .catch(() => {
      setStatus('Warning', 'somethingWentWrong')
    })
})

async function repeat() {
  if (!(await getData())) {
    return
  }
  const updateInterval = setInterval(async () => {
    checkRepeat.value = await getData()
    if (!checkRepeat.value && (status.value.title !== 'Expired' || expirationConfirmed)) {
      clearInterval(updateInterval)
    }
  }, 5000)
}

/**
 * @returns {Promise<boolean>} repeat get update next time
 */
async function getData() {
  if (status.value.title !== 'Expired' || !expirationConfirmed) {
    await getInvoiceById(id.value)
      .then(responseData => {
        remainsToPay.value = false
        responseData.created = (new Date(`${responseData.created}+00:00`)).toLocaleString(navigator.language || navigator.userLanguage)

        const responseStatus = responseData.status

        currencies.value.forEach(currency => {
          if (currency.abbr === responseData.currency) {
            let { amount } = responseData
            if (amount && responseStatus === 'partpaid') {
              responseData?.history.forEach(historyItem => {
                if (historyItem.status === 'partpaid') {
                  amount = amount - historyItem.amount
                  remainsToPay.value = true
                }
              })
            }
            factor.value = parseFloat(currency['units-factor'])
            const walletPrefix = `${currency.name.toLowerCase().replace(/[()]/g, '').split(' ').join('-')}:`
            const amountData = amount
              ? {
                value: trimDecimalZeros(bigInt.multiply(amount, parseFloat(currency['units-factor']))),
                isNumber: true,
              }
              : {
                value: '',
                isNumber: false,
              }
            Object.assign(responseData, {
              qr: `${walletPrefix}${responseData.address}${amountData.isNumber ? '?amount=' + amountData.value : ''}`,
              amount: `${amountData.value} ${amountData.isNumber ? responseData.currency.includes('@') ? responseData.currency.split('@')[0].toUpperCase() : responseData.currency.toUpperCase() : ''}`,
              amountData,
              currencyName: currency.name,
            })
          }
        })
        if (responseStatus === 'paid' || responseStatus === 'overpaid' || responseStatus === 'completed') {
          setStatus('Success', 'paymentAccepted')

          if (responseData.linkback && !loading.value) {
            linkback.value = responseData.linkback
            linkbackCounter.value = 15

            setInterval(() => {
              linkbackCounter.value -= 1
              if (linkbackCounter.value <= 0 && !embed.value && !qrOnly.value) {
                linkbackCounter.value = null
                document.location.href = responseData.linkback
              }
            }, 1000)
          }
        }
        else if (responseStatus === 'expired') {
          setStatus('Expired', 'expired')
          expirationConfirmed = true
        }
        else if (status.value.title !== 'Expired') {
          setStatus('Refresh', 'waitingForPayment')
        }
        if (responseData.expire) {
          countdown(responseData.expire)
        }
        data.value = responseData
        const responseUserData = responseData['user-data']
        if (responseUserData && typeof responseUserData === 'object') {
          if (!Array.isArray(responseUserData.extras)) {
            Object.assign(responseUserData, { extras: [] })
          }
          if (!Array.isArray(responseUserData.items)) {
            Object.assign(responseUserData, { items: null })
          }
          userData.value = responseUserData
        }
        loading.value = false
      })
      .catch(() => {
        const notLoading = !loading.value
        loading.value = false
        if (notLoading) {
          return
        }
        isNotFound.value = true
        setStatus('Warning', 'invoiceNotFound')
      })

    if (data.value.status === 'created' || data.value.status === 'partpaid') {
      document.title = `Invoice - ${userData.value.merchant ? userData.value.merchant : ''} ${data.value.invoice}`
      checkRepeat.value = true
      return true
    }
  }
  document.title = `Invoice - ${userData.value.merchant ? userData.value.merchant : ''} ${data.value.invoice}`
  return false
}
</script>

<style lang="scss">
@use "@/assets/scss/keyframes";
@use "@/assets/scss/loading";

.dark-theme {
  .invoice {
    &.loading {
      opacity: 0.6;
    }

    &__note {
      color: var(--light-blue);
    }

    &__not-found {
      &-content {
        & p {
          color: var(--light-blue);
          opacity: .7;
        }

        & i {
          & svg {
            path {
              fill: var(--light-blue);
              opacity: .7;
            }
          }
        }
      }
    }
  }
}

.light-theme {
  .invoice {
    &-expired {
      opacity: .6;
    }

    &__note {
      color: var(--grey-9);
    }

    &__not-found {
      &-content {
        & p {
          opacity: .7;
        }

        & i {
          & svg {
            path {
              fill: var(--dark-primary);
              opacity: .7;
            }
          }
        }
      }
    }
  }
}

.invoice {
  width: 95%;
  max-width: 35rem;
  padding: 2rem 0;

  &.invoice__qr-only {
    width: auto;
  }

  &__body {
    margin-top: 1rem;
  }

  &__not-found {
    &-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      & p {
        font-size: 32px;
        font-weight: 700;
      }
      & i {
        & svg {
          width: 54px;
          height: 54px;
        }
      }
    }
  }

  &__info {
    display: flex;
  }

  &__qr-only {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__qr-only .qr__wrapper {
    margin: 0 auto 1rem;
  }

  &__note {
    margin: 0 auto 2rem;
    width: 70%;
    font-weight: 500;
  }
}

@media screen and (max-width: 540px) {
  .invoice {
    &__info {
      flex-direction: column;
    }

    &__note {
      width: 90%;
    }
  }
}
</style>
