<template>
  <div
    v-if="status.title !== 'Success' && status.title !== 'Expired'"
    class="address"
  >
    <div class="address__title">
      {{ t("paymentAddress") }}
    </div>
    <p class="skeleton__box">
      <a
        class="address__link"
        :href="getExplorerHref(data.currencyName, 'address', data.address, data.currency)"
        target="_blank" v-if="status.title !== 'Expired'"
      >
        <SvgIcon v-if="!loading" name="link"/>

        <span v-if="shorterFlag">{{ getShorter(data.address) }}</span>
        <span v-else>{{ data.address }}</span>
      </a>
    </p>
    <CopyButton
      v-if="!loading && status.title !== 'Expired'"
      :text="data.address"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

import SvgIcon from '@/components/icons/SvgIcon.vue'
import CopyButton from '@/components/buttons/Copy.vue'

import useStatus from '@/composables/useStatus'
const { status } = useStatus()

import useExplorerHref from '@/composables/useExplorerHref'
const { getExplorerHref } = useExplorerHref()

const props = defineProps({
  data: {
    default: {}
  },
  loading: {
    default: false
  }
})

const shorterFlag = ref(false)

function setShorterFlag() {
  shorterFlag.value = window.innerWidth < 450
}

onMounted(() => {
  setShorterFlag()
  window.addEventListener('resize', setShorterFlag)
})

function getShorter(value) {
  return `${value.slice(0, 10)}...${value.slice(-10)}`;
}
</script>

<style lang="scss">
.dark-theme {
  .address {
    border-color: var(--light-blue);
    &__title {
      background-color: var(--dark-primary);
      color: rgba(239, 243, 248, 0.7);
    }

    &__link {
      color: var(--grey-e);
    }
  }
}

.light-theme {
  .address {
    border-color: var(--light-grey);
    &__title {
      background-color: var(--white);
      color: var(--grey);
    }

    &__link {
      color: var(--dark-primary);
    }
  }
}

.address {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  width: 100%;
  min-height: 4rem;
  margin: 1rem 0 0;
  padding: 0 1rem;
  border: 1px solid;
  border-radius: 1rem;

  &__link {
    display: flex;
    text-decoration: none;
    transition: 0.2s;
    word-break: break-word;
    width: 100%;

    i {
      width: 1.1rem;
      height: 1.1rem;
      svg {
        fill: var(--primary);
      }
    }

    span:first-child {
      font-size: 12px;
      margin-right: 8px;
      margin-top: 5px;
    }

    span:last-child {
      width: 100%;
      margin-left: 8px;
      text-wrap: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &:hover {
      opacity: 0.6;
    }
  }

  & p {
    max-width: 93%;
  }

  &__title {
    position: absolute;
    top: -.95rem;
    left: .7rem;
    padding: .3rem;
    font-size: .8rem;
  }
}

</style>