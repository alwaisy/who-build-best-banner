<script setup lang="ts">
import { computed } from 'vue'
interface Props {
  fullName?: string
  headline?: string
  username?: string
  siteName?: string
}

const props = withDefaults(defineProps<Props>(), {
  fullName: 'LinkedIn Creator',
  headline: 'Professional LinkedIn Banner Designer',
  username: 'creator',
  siteName: 'Best LinkedIn Banners'
})

// Truncate headline if too long
const truncatedHeadline = computed(() => {
  if (props.headline.length > 120) {
    return props.headline.substring(0, 120) + '...'
  }
  return props.headline
})
</script>

<template>
  <div class="w-full h-full bg-background flex flex-col justify-between p-16 relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
      <div class="absolute top-0 right-0 w-1/2 h-full">
        <div class="grid grid-cols-8 gap-2 h-full opacity-20">
          <div v-for="i in 96" :key="i" class="bg-muted/30 rounded-sm" />
        </div>
      </div>
    </div>

    <!-- Header with Logo and Site Name -->
    <div class="flex items-center justify-between relative z-10">
      <div class="flex items-center gap-4">
        <!-- Logo Icon -->
        <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center border border-border">
          <div class="w-6 h-6 bg-primary-foreground rounded-sm" />
        </div>
        <div class="text-xl font-semibold text-muted-foreground">{{ props.siteName }}</div>
      </div>
      
      <!-- Profile Indicator -->
      <div class="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full border border-border">
        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span class="text-sm font-medium text-foreground">Featured Creator</span>
      </div>
    </div>

    <!-- Main Content -->
    <div class="space-y-8 relative z-10 max-w-4xl">
      <!-- Profile Info -->
      <div class="space-y-6">
        <div class="flex items-center gap-4">
          <!-- Avatar Placeholder -->
          <div class="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full border-4 border-background shadow-lg flex items-center justify-center">
            <div class="text-2xl font-bold text-primary-foreground">
              {{ props.fullName.split(' ').map(n => n[0]).join('').substring(0, 2) }}
            </div>
          </div>
          
          <div class="space-y-2">
            <h1 class="text-5xl font-bold text-foreground leading-tight">
              {{ props.fullName }}
            </h1>
            <div class="text-lg text-muted-foreground">@{{ props.username }}</div>
          </div>
        </div>

        <!-- Headline -->
        <div class="bg-muted/30 p-6 rounded-xl border border-border">
          <p class="text-2xl text-foreground leading-relaxed font-medium">
            {{ truncatedHeadline }}
          </p>
        </div>
      </div>

      <!-- Banner Preview Mockup -->
      <div class="space-y-4">
        <div class="text-lg font-semibold text-foreground flex items-center gap-2">
          <div class="w-1 h-6 bg-primary rounded-full" />
          LinkedIn Banner Preview
        </div>
        <div class="bg-gradient-to-r from-muted to-muted/50 h-24 rounded-lg border border-border relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
          <div class="absolute bottom-2 left-4 right-4 flex justify-between items-end">
            <div class="space-y-1">
              <div class="h-2 bg-foreground/20 rounded w-24" />
              <div class="h-1.5 bg-foreground/15 rounded w-16" />
            </div>
            <div class="w-8 h-8 bg-primary/30 rounded-full" />
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between text-sm text-muted-foreground relative z-10">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 bg-primary rounded-full" />
        <span>Discover more inspiring banners</span>
      </div>
      <div class="flex items-center gap-6">
        <span>Who Made the Best Banner?</span>
      </div>
    </div>
  </div>
</template>
