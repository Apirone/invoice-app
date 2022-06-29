<template>
  <button
    @click="$emit('click')"
    :disabled="disabled"
    :class="['btn', 'hovered', {'btn_filled': filled, 'btn_loading': loading}]">
    <w-loader class="btn__loader"/>
    <span class="btn__text" v-if="text">{{text}}</span>
    <span class="btn__icon">
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  props: {
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
  },
};
</script>

<style scoped>
.btn {
  display: flex;
  align-items: center;
  position: relative;
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
  background-color: #fff;
  border: .0625rem solid #5d8ab9;
  border-radius: .625rem;
}

.btn:disabled {
  cursor: default;
  opacity: .6;
}

.btn_filled {
  color: #fff;
  background-color: #5d8ab9;
}

.btn_loading .btn__text {
  opacity: 0;
}

.btn__loader {
  position: absolute !important;
  opacity: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(.4);
}

.btn_loading .btn__loader {
  opacity: 1;
}
</style>

<style>
.btn_filled .lds .lds__elem {
  background: #fff;
}

.btn .btn__icon {
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
}
</style>
