<template>
  <button
    :disabled="disabled"
    :class="['btn', 'hovered', {'btn_filled': filled, 'btn_loading': loading}]">
    <span class="btn__text" v-if="text">{{ text }}</span>
    <span class="btn__icon">
      <slot></slot>
    </span>
  </button>
</template>

<script setup>
defineProps ({
  loading: {
    default: false,
  },
  filled: {
    default: false,
  },
  text: {
    default: '',
  },
  disabled: {
    default: false,
  },
})
</script>

<style lang="scss">
.btn {
  display: flex;
  align-items: center;
  position: relative;
  appearance: none;
  -webkit-appearance: none;
  outline: none;
  font: inherit;
  color: inherit;
  padding: .625rem;
  margin: 0;
  box-sizing: border-box;
  text-decoration: none;
  cursor: pointer;
  transition: .3s;
  background-color: var(--white);
  border: .0625rem solid var(--primary);
  border-radius: .625rem;

  &:disabled {
    cursor: default;
    opacity: .6;
  }

  &_filled {
    color: var(--white);
    background-color: var(--primary);
  }

  &_loading .btn__text {
    opacity: 0;
  }

  &_loading .btn__loader {
    opacity: 1;
  }

  &__loader {
    position: absolute !important;
    opacity: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(.4);
  }

  &_filled .lds .lds__elem {
    background: var(--white);
  }

  & .btn__icon {
    display: inline-block;
    width: 1.25rem;
    height: 1.25rem;
    font-size: 18px;
  }
}
</style>
