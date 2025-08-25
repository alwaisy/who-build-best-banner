<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  siteName?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Who Made the Best Banner?',
  description: 'Handpicked LinkedIn banners from top creators. Search by name, headline, or industry.',
  siteName: 'Best LinkedIn Banners'
})
</script>

<template>
  <div class="w-full h-full bg-background flex flex-col justify-between p-16 relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
      <div class="absolute top-0 left-0 w-full h-full">
        <div class="grid grid-cols-12 gap-4 h-full opacity-30">
          <div v-for="i in 144" :key="i" class="bg-muted/20 rounded-sm" />
        </div>
      </div>
    </div>

    <!-- Header with Logo -->
    <div class="flex items-center justify-between relative z-10">
      <div class="flex items-center gap-4">
        <!-- Logo Icon -->
        <div class="w-16 h-16 bg-primary rounded-lg flex items-center justify-center border border-border">
          <div class="w-8 h-8 bg-primary-foreground rounded-sm" />
        </div>
        <div class="text-2xl font-semibold text-foreground">{{ props.siteName }}</div>
      </div>
      
      <!-- Decorative Elements -->
      <div class="flex gap-3">
        <div class="w-3 h-3 bg-primary rounded-full" />
        <div class="w-3 h-3 bg-secondary rounded-full" />
        <div class="w-3 h-3 bg-accent rounded-full" />
      </div>
    </div>

    <!-- Main Content -->
    <div class="text-center space-y-8 relative z-10 max-w-4xl mx-auto">
      <h1 class="text-7xl font-bold text-foreground leading-tight tracking-tight">
        {{ props.title }}
      </h1>
      
      <p class="text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
        {{ props.description }}
      </p>

      <!-- Feature Highlights -->
      <div class="flex justify-center gap-8 mt-12">
        <div class="flex items-center gap-3 bg-muted/50 px-6 py-3 rounded-full border border-border">
          <div class="w-2 h-2 bg-green-500 rounded-full" />
          <span class="text-lg font-medium text-foreground">Curated Collection</span>
        </div>
        <div class="flex items-center gap-3 bg-muted/50 px-6 py-3 rounded-full border border-border">
          <div class="w-2 h-2 bg-blue-500 rounded-full" />
          <span class="text-lg font-medium text-foreground">Top Creators</span>
        </div>
        <div class="flex items-center gap-3 bg-muted/50 px-6 py-3 rounded-full border border-border">
          <div class="w-2 h-2 bg-purple-500 rounded-full" />
          <span class="text-lg font-medium text-foreground">Search & Filter</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between text-sm text-muted-foreground relative z-10">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 bg-primary rounded-full" />
        <span>LinkedIn Banner Inspiration</span>
      </div>
      <div class="flex items-center gap-6">
        <span>Discover • Explore • Create</span>
      </div>
    </div>
  </div>
</template>
