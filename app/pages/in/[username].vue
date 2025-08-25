<script setup lang="ts">
import type { Profile } from "~/lib/schema";
import { fetchProfiles } from "~/composables/use-profiles";
import { useProfileVersions } from "~/composables/use-profile-versions";
definePageMeta({ viewTransition: true });

const route = useRoute();
const router = useRouter();
const username = computed(() => route.params.username as string);

// Fetch the normalized profile (latest version) by username
const { data: item } = await useAsyncData(
  () => `/in/${username.value}`,
  async () => {
    const list = await fetchProfiles();
    return list.find((p) => p.username === username.value) as Profile | undefined;
  },
  { server: true }
);

if (!item.value) {
  throw createError({ statusCode: 404, statusMessage: "Profile not found" });
}

// Use composable to list and select versions (defaults to latest)
const { versions, currentVersion, selected } = useProfileVersions(username);

// Unified selected item (fallback to normalized latest when no explicit selection)
const selectedOrItem = computed<Profile>(() => selected.value ?? (item.value as Profile));

const ogDescription = computed(
  () =>
    selectedOrItem.value?.headline ||
    selectedOrItem.value?.about?.slice(0, 100) ||
    "View this LinkedIn banner profile."
);

useHead({
  title: `${selectedOrItem.value.fullName ?? selectedOrItem.value.username} | Profile`,
  meta: [
    {
      name: "description",
      content: ogDescription.value,
    },
  ],
});

defineOgImageComponent("Frame", {
  name: selectedOrItem.value?.fullName || selectedOrItem.value?.username,
  subtitle: ogDescription.value,
  bannerUrl: Array.isArray(selectedOrItem.value?.bannerImageUrl)
    ? selectedOrItem.value?.bannerImageUrl?.[0]
    : undefined,
  avatarUrl: selectedOrItem.value?.profileImageUrl,
  siteName: "Best LinkedIn Banners",
  borderColor: "#0a66c2",
});
</script>

<template>
  <div class="container mx-auto max-w-5xl py-6 md:py-8 lg:py-10">
    <div class="mb-2 flex items-center justify-between">
      <Button variant="secondary" size="sm" @click="router.back()">
        <Icon name="mdi:arrow-left" />
        Back to Home
      </Button>
      <template v-if="(versions?.length || 0) > 1">
        <ClientOnly>
          <Select v-model="currentVersion">
            <SelectTrigger size="sm" class="w-[180px]">
              <SelectValue :placeholder="`Version: ${currentVersion || 'latest'}`" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="v in versions"
                :key="v.key"
                :value="v.key"
              >
                {{ v.key }} — {{ new Date(v.profile.scrapedAt).toLocaleDateString() }}
              </SelectItem>
            </SelectContent>
          </Select>
        </ClientOnly>
      </template>
      <template v-else>
        <Badge variant="secondary">Version: {{ versions?.[0]?.key || 'v1' }}</Badge>
      </template>
    </div>
    <div class="flex flex-col gap-6">
      <SharedProfileCard :item="selectedOrItem as Profile" />

      <DetailsAboutCard v-if="selectedOrItem?.about" :about="selectedOrItem.about" />
    </div>
  </div>
</template>

