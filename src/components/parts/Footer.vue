<template>
  <footer
    v-if="typeof logo === 'string'"
    v-html="logo"
  ></footer>

  <footer v-else-if="logo === true">
    <p>
      Powered by
      <a
        href="https://apirone.com/"
        title="Apirone"
        class="link hovered"
      >
        <SvgIcon
          name="logo-primary"
          class="logo"
        />
      </a>
    </p>
  </footer>
</template>

<script setup>
import SvgIcon from '@/components/icons/SvgIcon.vue'

const props = defineProps({
  embed: {
    type: Boolean,
    default: false,
  },
  logo: {
    type: [Boolean, String],
    default: false,
  },
})
</script>

<style lang="scss">
footer {
  color: var(--grey);

  & p {
    text-align: center;
  }

  & .logo>svg {
    width: 5rem;
    height: 100%;
    transform: translateY(2px);
    fill: var(--primary);
  }
}
</style>