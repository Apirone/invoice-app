<template>
  <span v-if="amount">
    <span v-if="splitNumberParts(trimDecimalZeros(amount)).integer">{{ splitNumberParts(trimDecimalZeros(amount)).integer }}.</span>
    <span v-if="splitNumberParts(trimDecimalZeros(amount)).decimal" style="font-size: 14px;">{{ splitNumberParts(trimDecimalZeros(amount)).decimal }}</span>
    <span v-if="splitNumberParts(trimDecimalZeros(amount)).currency" style="margin-left: 6px;">{{ splitNumberParts(trimDecimalZeros(amount)).currency }}</span>
  </span>
</template>

<script setup>
import splitNumberParts from "@/utils/splitNumberParts"
import trimDecimalZeros from "@/utils/trimDecimalZeros"

defineOptions({
  name: "Amount",
})

defineProps({
  amount: {
    default: 0
  },
})
</script>
