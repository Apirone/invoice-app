<template>
  <i
    v-if="html"
    v-html="html"
    :class="{ spin }"/>
</template>

<script setup>
const props = defineProps({
  /** icon name without path and extension */
  name: String,

  /** icon is a currency and it must be found in "currencies" folder */
  currency: Boolean,

  /** turn on icon rotation animation */
  spin: Boolean,
})

import { ref, watch } from 'vue'
import { publicPath, getEnv } from '@/utils/env'

const IMAGES_RELATIVE_PATH = getEnv('images_relative_path') || 'img'

const FALLBACK_IMAGE_CONTENT = '<svg></svg>'

const FALLBACK_CURRENCY_IMAGE_NAME = 'placeholder'

const html = ref(null)

let isFallback

function loadError(...args) {
  if (props.currency && !isFallback) {
    isFallback = true
    getSvgByName(FALLBACK_CURRENCY_IMAGE_NAME)
    return
  }
  html.value = FALLBACK_IMAGE_CONTENT
  console.warn(...args)
}

function getSvgByName(name) {
  const imgName = ('' + name)?.trim()
  if (!imgName) {
    loadError('Image not specified')
    return
  }
  const url = `${publicPath}${IMAGES_RELATIVE_PATH}/${props.currency ? 'currencies/' : ''}${imgName}.svg`
  fetch(url)
    .then(response => {
      if (!response.ok) {
        loadError(response.statusText, url)
        return
      }
      return response.text()
    })
    .then(text => {
      if (!/<\s*svg/ig.test(text)) {
        loadError('Not an SVG image', url)
        return
      }
      html.value = text
    })
    .catch(loadError)
}

watch(() => props, v => {
  isFallback = false
  getSvgByName(v.name)
}, {
  deep: true,
  immediate: true,
})
</script>

<style scoped>
i.spin {
  animation: apr-spin 2s linear infinite;
  display: inline-block;
}

@keyframes apr-spin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>