<script setup lang="ts">
useHead({
  htmlAttrs: { class: "dark" },
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage view-transition />
    <NuxtLoadingIndicator color="#8b5cf6" :height="8" />
  </NuxtLayout>
</template>
