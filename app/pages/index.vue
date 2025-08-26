<script setup lang="ts">
import Fuse from "fuse.js";
import featured from "~/config/featured";

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
// Providers-only toggle (from Hero checkbox)
const providersOnly = ref(false);

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

// Simple SSR-friendly fetch of all profiles (normalized to latest version)
const {
  data: profiles,
  pending,
  error,
  refresh,
} = await useAsyncData("profiles:all", () => fetchProfiles(), {
  server: true,
  default: () => [],
});

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
  const base = profiles.value || [];
  const list = q
    ? fuse.value.search(q).map((r) => r.item)
    : orderProfiles(base, featured);
  return providersOnly.value ? list.filter((p) => p.isProvider === true) : list;
});

// Infinite list (10 per load) using composable
const { visibleItems, canLoadMore, sentinel, loadMore } = useInfiniteList(items, {
  pageSize: 10,
  resetOn: [debouncedQuery, providersOnly],
});
</script>

<template>
  <div class="">
    <HomeHero v-model="query" v-model:providers-only="providersOnly" />

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
    <div v-else>
      <HomeProfilesList :items="visibleItems" />
      <div v-if="canLoadMore" class="mt-6 flex flex-col items-center gap-3">
        <div ref="sentinel" class="h-1 w-full" aria-hidden="true" />
        <!-- Fallback button in case IntersectionObserver doesn't trigger -->
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
          @click="loadMore()"
        >
          Load more
        </button>
      </div>
    </div>
  </div>
</template>
