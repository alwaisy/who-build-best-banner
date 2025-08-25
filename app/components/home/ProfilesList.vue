<script setup lang="ts">
import type { Profile } from "~/lib/schema"

// Presentational list component: expects items from parent
defineProps<{ items: Profile[] }>()
</script>

<template>
  <div class="flex flex-col gap-6">
    <SharedProfileCard
      v-for="item in items"
      :key="item.username"
      :item="item"
    />
  </div>
</template>
