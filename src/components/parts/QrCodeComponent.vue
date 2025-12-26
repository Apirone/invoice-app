<template>
  <div
    :class="['qr__wrapper', {'qr__only': qrOnly}, {'qr__wrapper-success' : status.title === 'Success'}]"
  >
    <div class="skeleton__box">
      <figure
        v-if="!loading && status.title !== 'Expired' && status.title !== 'Success'"
        class="qr"
      >
        <QrCode
          :value="data.qr"
          :size="160"
          level="H"
        />
        <SvgIcon
          class="qr__image"
          :name="transformCurrency.currency"
          currency
        />
        <SvgIcon
          v-if="transformCurrency.network"
          class="qr__image-network"
          :name="transformCurrency.network"
          currency
        />
      </figure>
      <div
        v-else-if="status.title === 'Success'"
        class="qr__success"
      >
        <SvgIcon name="checkbox_circle"/>
      </div>
      <div
        v-else-if="status.title === 'Expired'"
        class="qr__expired"
      >
        <SvgIcon name="stopwatch"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import QrCode from 'qrcode.vue'
import SvgIcon from '@/components/icons/SvgIcon.vue'

import useStatus from '@/composables/useStatus'
const { status } = useStatus()

const props = defineProps({
  data: {
    default: {}
  },
  loading: {
    default: false
  },
  qrOnly: {
    default: false
  }
})

const transformCurrency = computed(() => {
  if (!Object.keys(props.data).length || !props.data.currency) {
    return false
  }
  if (props.data.currency.includes('@')) {
    const splitCurrency = props.data.currency.split('@')
    return {
      currency: splitCurrency[0],
      network: splitCurrency[1],
    }
  }
  return {
    currency: props.data.currency,
    network: false,
  }
})
</script>

<style lang="scss">
.dark-theme {
  .invoice-expired {
    .qr__wrapper {
      background-color: initial !important;
    }
  }

  .qr {
    &__wrapper {
      background-color: var(--grey-e) ;
    }
    &__expired svg {
      fill: var(--grey-e);
    }
  }
}

.light-theme {
  .qr {
    &__wrapper {
      background-color: var(--white);
    }
    &__expired svg {
      fill: var(--dark-primary);
    }
  }
}

.qr {
  display: inline-block;
  font-size: 0;
  margin: 0;
  position: relative;

  &__only {
    min-width: auto !important;
    width: 10rem;
  }

  &__wrapper {
    min-width: 10rem;
    height: 10rem;
    border: .0625rem solid var(--light-grey);
    padding: 1rem;
    border-radius: 1rem;
    overflow: hidden;
    align-self: center;
    font-size: 110px;
    &-success {
      background-color: initial !important;
    }

    & > div {
      width: 100%;
      height: 100%;
    }

    & img {
      width: 100%;
      height: 100%;
    }

    & canvas {
      max-width: 100%;
    }
  }

  &__image {
    svg {
      background-color: var(--white);
      border: 0.25rem solid var(--white);
      border-radius: 50%;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.25);
      height: 15% !important;
      left: 50%;
      overflow: hidden;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 15% !important;
    }
    &-network {
      svg {
        position: absolute;
        top: 57%;
        left: 58%;
        transform: translate(-50%, -50%);
        width: 11% !important;
        background-color: var(--white);
        border: 2px solid var(--white);
        border-radius: 50%;
        box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.25);
        height: 11% !important;
        overflow: hidden;
      }
    }
  }

  &__success, &__expired {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  &__success i,
  &__success i>svg {
    width: 7rem;
    height: 7rem;
    svg, path {
      fill: var(--success);
    }
  }

  &__expired i {
    width: 7rem;
    height: 7rem;
    svg {
      fill: var(--dark-primary);
    }
  }
}

@media (max-width: 540px) {
  .qr {
    &__wrapper {
      margin-top: 1rem;
      width: 10rem;
      min-width: auto;
    }
  }
}
</style>