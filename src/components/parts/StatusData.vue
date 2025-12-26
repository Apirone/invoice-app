<template>
  <div class="status-data__wrapper">
    <div
      :class="['status-data', { historyFlag }]"
      ref="statusData"
    >
      <div
        :class="['status', { skeleton__box: status.title !== 'Warning' }, `${status.title.toLowerCase()}`]"
        ref="status"
      >
        <div class="status__icon">
          <StatusIcons :status="status.title"/>
        </div>
        <div class="status__text">
          <p v-if="status.description">{{ t(status.description) }}</p>
          <p
            v-if="expire && status.title !== 'Success'"
            class="countdown"
          >
            {{ expire }}
          </p>
        </div>
      </div>
      <div
        class="history"
        v-if="data.history"
        ref="history"
      >
        <ul ref="historyList">
          <li
            v-for="(item, id) in data.history"
            :key="id"
          >
            <component
              :is="(item.status === 'paid') || (item.status === 'partpaid') || (item.status === 'overpaid') ? 'a' : 'span'"
              class="history__item"
              :href="getExplorerHref(data.currencyName, 'transaction', item.txid, data.currency)"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>
                {{ (new Date(`${item.date}+00:00`)).toLocaleString() }}
                <span v-if="item.amount">
                  (<Amount :amount="bigInt.multiply(item.amount, factor)" />)
                </span>
              </span>
              <span style="text-align: right;">
                {{ te(`statuses.${item.status}`) ? t(`statuses.${item.status}`) : item.status }}
              </span>
            </component>
          </li>
        </ul>
      </div>
      <ToggleButton
        @click="historyFlag = !historyFlag"
        class="toggler"
      >
        <SvgIcon name="arrow_light_up"/>
      </ToggleButton>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, useTemplateRef } from 'vue'

import { useI18n } from 'vue-i18n'
const { t, te } = useI18n()

import bigInt from '@/utils/BigIntUtils'

import SvgIcon from '@/components/icons/SvgIcon.vue'
import StatusIcons from '@/components/parts/StatusIcons.vue'
import Amount from '@/components/Amount.vue'
import ToggleButton from '@/components/buttons/Button.vue'

import useExplorerHref from '@/composables/useExplorerHref'
const { getExplorerHref } = useExplorerHref()

const props = defineProps({
  status: {
    default: {}
  },
  data: {
    default: {}
  },
  expire: {
    default: null
  },
  factor: {
    default: null
  },
  checkRepeat: {
    default: null
  }
})

const historyFlag = ref(false)

const historyRef = useTemplateRef('history')
const historyListRef = useTemplateRef('historyList')
const statusDataRef = useTemplateRef('statusData')

watch(historyFlag, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    nextTick(() =>
      toggleHistory())
  }
})

watch(() => props.data.history, (newVal, oldVal) => {
  if (!props.checkRepeat) {
    nextTick(() =>
      toggleHistory())
  }
  else if ((newVal ? newVal.length : undefined) !== (oldVal ? oldVal.length : undefined)) {
    nextTick(() => {
      if (historyFlag.value) {
        const lastLi = historyListRef.value.lastElementChild?.tagName === 'LI'
          ? historyListRef.value.lastElementChild
          : null
        toggleHistory(Math.ceil(lastLi.offsetHeight))
      } else if (!historyFlag.value) {
        toggleHistory(11)
      }
    })
  }
}, {
  immediate: true,
  deep: true,
})

function toggleHistory(newStatus = 0) {
  if (props.data.history) {
    const history = historyRef.value
    const statusData = statusDataRef.value
    const lastLi = historyListRef.value.lastElementChild?.tagName === 'LI'
      ? historyListRef.value.lastElementChild
      : null
    if (!historyFlag.value) {
      history.style.transform = `translateY(-${history.offsetHeight + (newStatus === 22 ? 22 : 0)}px)`
      // history.style.opacity = '0'
      statusData.style.height = `${statusData.offsetHeight - (newStatus === 0 ? history.offsetHeight : 0) - (newStatus === 11 ? 16 : 0) - (newStatus === Math.ceil(lastLi.offsetHeight / 4) ? newStatus : 0)}px`
    } else {
      history.style.transform = 'translateY(-.75rem)'
      // history.style.opacity = '1'
      statusData.style.height = `${statusData.offsetHeight + (newStatus === 0 ? history.offsetHeight - 32 : 0) + (newStatus === 11 ? 16 : 0) + (newStatus === Math.ceil(lastLi.offsetHeight) ? newStatus - 16 : 0)}px`
    }
  }
}
</script>

<style lang="scss">
@use "@/assets/scss/status";
@use "@/assets/scss/history";

.dark-theme {
  .status-data {
    & .toggler {
      border-color: var(--light-blue) !important;
      background-color: initial !important;
      svg>path {
        fill: var(--grey-e);
      }
    }
  }
}

.light-theme {
  .status-data {
    & .toggler {
      border-color: var(--light-grey) !important;
      background-color: var(--light-grey) !important;
      svg>path {
        fill: var(--dark-primary);
      }
    }
  }
}

.status-data {
  padding: 0 0 1rem;
  position: absolute;
  width: 100%;
  overflow-y: hidden;
  transition: 0.4s;
  border-radius: 1rem 1rem 0 0;

  & .toggler .btn__icon {
    transform: rotate(180deg);
    svg {
      width: 65%;
      height: 65%;
    }
  }

  & .toggler {
    position: absolute !important;
    right: 1rem !important;
    margin-top: 0 !important;
    border-radius: 0 0 0.3rem 0.3rem !important;
    padding: 0 0.5rem !important;
    bottom: 10px !important;
  }

  &.historyFlag .toggler {
    bottom: 7px !important;
  }

  &.historyFlag .toggler .btn__icon {
    transform: rotate(0deg);
  }

  &__wrapper {
    position: relative;
    margin-top: 1rem;
    min-height: 6rem;
    width: 100%;
    z-index: 9;
  }
}
</style>