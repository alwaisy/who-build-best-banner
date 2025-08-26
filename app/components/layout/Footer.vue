<script setup lang="ts">
// const year = new Date().getFullYear();
</script>

<template>
  <footer class="border-t border-border/80 bg-background/60">
    <div
      class="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 py-8 text-sm text-muted-foreground"
    >
      <div class="flex items-center justify-between">
        <SharedLogo
          :size="36"
          :show-text="true"
          text="Who Made Best Banner"
          to="/"
        />
        <!-- <p>&copy; {{ year }}</p> -->
        <div class="flex items-center gap-4">
          <NuxtLink 
            v-umami="{
              name: 'footer_link_click',
              link: 'about',
              destination: '/about',
              location: 'footer'
            }"
            to="/about" 
            class="hover:text-foreground"
          >About</NuxtLink>
          <NuxtLink 
            v-umami="{
              name: 'footer_link_click',
              link: 'submit',
              destination: '/submit',
              location: 'footer'
            }"
            to="/submit" 
            class="hover:text-foreground"
          >Submit</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
