<template>
  <button
    class="btn__copy hovered"
    @click="copy()"
    :disabled="disabled"
  >
    <SvgIcon :name="success ? 'copy_success' : 'copy'" :class="{'icon_copy-success': success}"/>
    <span
      v-if="title"
      class="btn__copy-title"
    >
      {{ title }}
    </span>
  </button>
</template>

<script setup>
import { ref } from 'vue'

import copyTextToClipboard from '@/utils/clipboard'

import SvgIcon from '@/components/icons/SvgIcon.vue'

const props = defineProps({
  title: {
    default: '',
  },
  text: {
    default: '',
  },
  disabled: {
    default: false,
  },
})

const success = ref(false)

function copy() {
  copyTextToClipboard(props.text).then(result =>
    success.value = result)
}
</script>

<style lang="scss">
.btn__copy {
  appearance: none;
  -webkit-appearance: none;
  outline: none;
  display: flex;
  border: 0;
  background-color: initial;
  align-items: center;
  margin: 0;
  padding: 0;
  cursor: copy;
  transition: .3s;

  &-title {
    margin-left: .3rem;
  }

  &:disabled {
    cursor: default;
    opacity: .6;
  }

  i {
    width: 1rem;
    height: 1rem;
    transform: translateY(1px);
    svg {
      fill: var(--primary);
    }
  }

  .icon_copy-success {
    position: relative;
    svg {
      fill: var(--success);
    }
  }
}
</style>
