<script setup lang="ts">
import { queryCollection, useAsyncData } from "#imports";
import Fuse from "fuse.js";
import { computed, onBeforeUnmount, ref, watch } from "vue";
import HomeHero from "~/components/home/Hero.vue";

definePageMeta({ viewTransition: true });
defineOgImageComponent("Frame", {
  title: "Who Made the Best Banner?",
  description:
    "Handpicked LinkedIn banners from top creators. Search by name, headline, or industry.",
  siteName: "Best LinkedIn Banners",
});

// Local state to satisfy HomeHero v-model; not used for filtering
const query = ref("");
const debouncedQuery = ref("");
let debounceTimer: ReturnType<typeof setTimeout> | undefined;

// Debounce query updates
watch(
  query,
  (val) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debouncedQuery.value = val ?? "";
    }, 250);
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  if (debounceTimer) clearTimeout(debounceTimer);
});

// Simple SSR-friendly fetch of all profiles
const {
  data: profiles,
  pending,
  error,
  refresh,
} = await useAsyncData(
  "profiles:all",
  () => queryCollection("profiles").all(),
  {
    server: true,
    default: () => [],
  }
);

// Build a Fuse instance over profiles when data is available
const fuse = computed(
  () =>
    new Fuse(profiles.value || [], {
      // Search across these fields
      keys: ["fullName", "headline", "about"],
      includeScore: false,
      threshold: 0.35,
      ignoreLocation: true,
    })
);

// Computed filtered items based on query
const items = computed(() => {
  const q = debouncedQuery.value?.trim();
  if (!q) return profiles.value || [];
  return fuse.value.search(q).map((r) => r.item);
});
</script>

<template>
  <div class="">
    <HomeHero v-model="query" />

    <!-- Loading State (only when no data yet) -->
    <div
      v-if="pending && !profiles.length"
      class="py-8 text-center text-muted-foreground"
    >
      Loading profiles…
    </div>

    <!-- Error State -->
    <div v-else-if="error && !pending" class="py-8 text-center">
      <div class="mb-4 text-destructive">Failed to load profiles.</div>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
        :disabled="pending"
        @click="refresh()"
      >
        Retry
      </button>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!pending && !error && !items.length"
      class="py-8 text-center text-muted-foreground"
    >
      No profile found.
    </div>

    <!-- Success State -->
    <HomeProfilesList v-else :items="items" />
  </div>
</template>
