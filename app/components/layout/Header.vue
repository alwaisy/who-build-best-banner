<script setup lang="ts">
</script>

<template>
  <header class="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="mx-auto flex h-14 w-full max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-2">
        <SharedLogo :size="36" :show-text="true" text="Who Made Best Banner" to="/" />
      </div>
      <nav class="flex items-center gap-3">
        <Button as-child size="sm" variant="ghost">
          <NuxtLink 
            v-umami="{
              name: 'navbar_navigation',
              link: 'about',
              destination: '/about',
              location: 'header'
            }"
            to="/about"
          >About</NuxtLink>
        </Button>
        <Button as-child size="sm">
          <NuxtLink 
            v-umami="{
              name: 'navbar_navigation',
              link: 'submit',
              destination: '/submit',
              location: 'header'
            }"
            to="/submit"
          >Submit</NuxtLink>
        </Button>
      </nav>
    </div>
  </header>
</template>
