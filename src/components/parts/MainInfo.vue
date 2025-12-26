<template>
  <div class="info">
    <div v-if="userData">
      <h1 v-if="userData.title" :class="{'info__title': userData.title.length > 50}">
        {{ userData.title }}
      </h1>
      <h1 v-else>
        {{ t("title") }}
        <small v-if="data.invoice">({{ data.invoice }})</small>
      </h1>
      <p class="info__merchant" v-if="userData.merchant">
        {{ t("from") }}
        <a v-if="userData.url" :href="userData.url" target="_blank" rel="noopener noreferrer"
           class="link hovered">{{ userData.merchant }}</a>
        <span v-else>{{ userData.merchant }}</span>
      </p>
    </div>
    <h1 v-else>
      {{ t("title") }} <small v-if="data.invoice">({{ data.invoice }})</small>
    </h1>
    <p class="skeleton__box info__date">
      <span>{{ data.created }}</span>
    </p>
    <p class="skeleton__box info__amount">
      <small v-if="remainsToPay">{{ t("remainsToPay") }}</small>
      <Amount :amount="data.amount" />
      <CopyButton
        v-if="!loading && data?.amountData?.isNumber && (status.title !== 'Success' && status.title !== 'Expired')"
        :text="data.amountData.value"
        style="margin-left: .5rem;"
      />
    </p>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

import Amount from '@/components/Amount.vue'
import CopyButton from '@/components/buttons/Copy.vue'

import useStatus from '@/composables/useStatus'
const { status } = useStatus()

const props = defineProps({
  userData: {
    default: {}
  },
  data: {
    default: {}
  },
  remainsToPay: {
    default: false
  },
  loading: {
    default: false
  },
})
</script>

<style lang="scss">
.dark-theme {
  .loading {
    .info {
      &__date {
        opacity: 1;
      }
    }
  }

  .info {
    h1 {
      color: var(--light-blue);
      small {
        color: var(--grey-e);
      }
    }
    &__amount {
      .amount {
        color: var(--light-blue);
      }
    }

    &__date {
      opacity: 0.7;
    }
  }
}

.light-theme {
  .info {
    &__date {
      color: var(--grey);
    }
  }
}

.info {
  margin-left: 2rem;
  flex-grow: 1;
  width: 100%;

  &__title {
      font-size: 26px;
      line-height: 1.3;
      margin-bottom: 8px !important;
  }

  &__date {
    margin: 0;
  }

  &__amount {
    display: flex;
    flex-wrap: wrap;
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 0;
  }

  &__amount small {
    width: 100%;
    margin-bottom: .5rem;
    opacity: .7;
  }

  &__merchant {
    margin-top: 0;
  }

  & h1 {
    margin: 0;
      word-break: break-word;
  }

  & h1 small {
    font-size: 50%;
    opacity: .6;
  }
}

@media (max-width: 540px) {
  .info {
    order: -1;
    margin-left: 0;
  }
}

</style>