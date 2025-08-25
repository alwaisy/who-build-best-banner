<script setup lang="ts">
</script>

<template>
  <div class="min-h-dvh bg-background text-foreground flex flex-col">
    <LayoutHeader />
    <main class="mx-auto w-full max-w-[1024px] px-4 sm:px-6 lg:px-8 py-8 flex-1">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>
