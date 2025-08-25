<script setup lang="ts">
interface Props {
  to?: string
  showText?: boolean
  text?: string
  size?: number // pixels for icon box (square)
}

const props = withDefaults(defineProps<Props>(), {
  to: '/',
  showText: true,
  text: 'Who Made Best Banner',
  size: 32,
})
</script>

<template>
  <NuxtLink :to="props.to" class="inline-flex items-center gap-2" aria-label="Home">
    <!-- favicon from /public -->
    <img
      :src="'/favicon.svg'"
      :alt="props.text"
      class="shrink-0 rounded-md border border-border"
      :style="{ width: `${props.size}px`, height: `${props.size}px` }"
    />
    <span v-if="props.showText" class="font-semibold leading-none">{{ props.text }}</span>
  </NuxtLink>
</template>
