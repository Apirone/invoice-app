<template>
  <button
    class="btn__copy hovered"
    @click="copy()"
    :disabled="disabled">
    <input type="hidden" :value="text" readonly :ref="uid">
    <span role="img">
      <CopyIcon class="btn__copy-img" v-if="!success"/>
      <CopySuccessIcon class="btn__copy-img" v-else/>
    </span>
    <span class="btn__copy-title" v-if="title">{{title}}</span>
  </button>
</template>

<script>
import CopyIcon from '@/components/icons/CopyIcon.vue';
import CopySuccessIcon from '@/components/icons/CopySuccessIcon.vue';

/* eslint no-underscore-dangle: 0 */
export default {
  components: {
    CopyIcon,
    CopySuccessIcon,
  },
  data() {
    return {
      uid: null,
      success: false,
    };
  },
  props: {
    title: {
      default: '',
    },
    text: {
      default: '',
    },
    disabled: {
      default: false,
    },
  },
  mounted() {
    this.uid = `copy${this._uid}`;
  },
  methods: {
    copy() {
      const copyText = this.$refs[this.uid];
      copyText.type = 'text';
      copyText.select();
      document.execCommand('copy');
      copyText.type = 'hidden';
      this.success = true;
      setTimeout(() => {
        this.success = false;
      }, 1000);
    },
  },
};
</script>

<style scoped>
.btn__copy {
  -webkit-appearance: none;
  outline: none;
  font: inherit;
  color: inherit;
  display: flex;
  border: 0;
  background-color: #fff;
  align-items: center;
  margin: 0;
  padding: 0;
  color: rgba(93, 138, 185, 1);
  cursor: copy;
  transition: .3s;
}

.btn__copy-title {
  margin-left: .3rem;
}

.btn__copy:disabled {
  cursor: default;
  opacity: .6;
}

.btn__copy-img {
  transform: translateY(.125rem);
  width: 1rem;
  height: 1rem;
}
</style>

<style>
.btn__copy-img.icon_copy-success {
  color: green;
}
</style>
