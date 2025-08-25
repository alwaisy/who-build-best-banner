<script setup lang="ts">
import type { Profile } from "~/lib/schema";
definePageMeta({ viewTransition: true });

const route = useRoute();
const router = useRouter();
const username = computed(() => route.params.username as string);

// Fetch the profile from the Nuxt Content `profiles` data collection
const { data: item } = await useAsyncData(
  () => `/in/${username.value}`,
  () =>
    queryCollection("profiles").where("username", "=", username.value).first(),
  { server: true }
);

if (!item.value) {
  throw createError({ statusCode: 404, statusMessage: "Profile not found" });
}

const ogDescription = computed(
  () =>
    item.value?.headline ||
    item.value?.about?.slice(0, 100) ||
    "View this LinkedIn banner profile."
);

useHead({
  title: `${item.value.fullName ?? item.value.username} | Profile`,
  meta: [
    {
      name: "description",
      content: ogDescription.value,
    },
  ],
});

defineOgImageComponent("Frame", {
  name: item.value?.fullName || item.value?.username,
  subtitle: ogDescription.value,
  bannerUrl: Array.isArray(item.value?.bannerImageUrl)
    ? item.value?.bannerImageUrl?.[0]
    : undefined,
  avatarUrl: item.value?.profileImageUrl,
  siteName: "Best LinkedIn Banners",
  borderColor: "#0a66c2",
});
</script>

<template>
  <div class="container mx-auto max-w-5xl py-6 md:py-8 lg:py-10">
    <div class="mb-2">
      <Button variant="secondary" size="sm" @click="router.back()">
        <Icon name="mdi:arrow-left" />
        Back to Home
      </Button>
    </div>
    <div class="flex flex-col gap-6">
      <SharedProfileCard :item="item as Profile" />

      <DetailsAboutCard v-if="item?.about" :about="item.about" />
    </div>
  </div>
</template>
