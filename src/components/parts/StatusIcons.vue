<template>
  <span v-if="status !== 'Loading'">
    <SvgIcon
      :name="
        status === 'Success' ? 'checkbox_circle' :
        status === 'Expired' ? 'stopwatch' :
        status === 'Warning' ? 'warn-note' : 'spinner'
      "
      :spin="status === 'Refresh'"
    />
  </span>
</template>

<script setup>
import SvgIcon from '@/components/icons/SvgIcon.vue'

const props = defineProps({
  status: {
    default: null
  }
})
</script>