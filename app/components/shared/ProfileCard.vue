<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import type { Profile } from "~/lib/schema";

const props = defineProps<{ item: Profile }>();

const bannerUrl = computed(() => {
  const b = props.item.bannerImageUrl;
  if (Array.isArray(b)) return b[0] ?? null;
  return b ?? null;
});

// Likes state
const likeCount = ref(0);
const liked = ref(false);
const likeLoading = ref(false);

// Uploader (author) link: prefer item.uploaderLinkedin else fallback to alwaisy
const uploaderUrl = computed(() => {
  const fromContent = props.item.uploaderLinkedin ?? undefined
  if (fromContent && fromContent.startsWith('http')) return fromContent
  return 'https://www.linkedin.com/in/alwaisy'
});

const uploaderHandle = computed(() => {
  try {
    const url = new URL(uploaderUrl.value);
    // Expect /in/<username>
    const parts = url.pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("in");
    const handle = idx >= 0 && parts[idx + 1] ? parts[idx + 1] : parts[parts.length - 1];
    return `@${handle}`;
  } catch {
    return "@uploader";
  }
});

onMounted(async () => {
  try {
    const res = await $fetch<{ count: number; liked: boolean }>(`/api/likes/${props.item.username}`);
    likeCount.value = res.count;
    liked.value = res.liked;
  } catch {
    // ignore
  }
});

async function toggleLike() {
  if (likeLoading.value) return;
  likeLoading.value = true;
  const wasLiked = liked.value;
  // optimistic
  liked.value = !wasLiked;
  likeCount.value += wasLiked ? -1 : 1;
  try {
    const res = await $fetch<{ count: number; liked: boolean }>(`/api/likes/${props.item.username}`, {
      method: wasLiked ? "DELETE" : "POST",
    });
    likeCount.value = res.count;
    liked.value = res.liked;
  } catch {
    // revert on error
    liked.value = wasLiked;
    likeCount.value += wasLiked ? 1 : -1;
  } finally {
    likeLoading.value = false;
  }
}
</script>

<template>
  <Card style="padding-top: 0">
    <NuxtLink
      :to="`/in/${item.username}`"
      class="w-full rounded-t-xl"
      view-transition
    >
      <img
        v-if="bannerUrl"
        :src="bannerUrl as string"
        :alt="(item.fullName ?? item.username) + ' banner'"
        class="block w-full object-cover object-center rounded-t-xl"
        :style="{ viewTransitionName: `banner-${item.username}` }"
      />
      <div v-else class="h-[300px] w-full bg-muted" />
    </NuxtLink>

    <NuxtLink :to="`/in/${item.username}`" view-transition>
      <CardContent class="relative">
        <div class="absolute left-6 z-10" style="top: -76px">
          <Avatar
            class="size-28 md:size-40 rounded-full border-4 border-white bg-[#0077b5] overflow-hidden shadow-sm transition-all"
          >
            <AvatarImage
              v-if="item.profileImageUrl"
              :src="item.profileImageUrl"
              :alt="(item.fullName ?? item.username) + ' avatar'"
              :style="{ viewTransitionName: `avatar-${item.username}` }"
            />
            <AvatarFallback class="text-white text-6xl font-bold">
              {{ (item.fullName ?? item.username).slice(0, 2).toUpperCase() }}
            </AvatarFallback>
          </Avatar>
        </div>

        <div class="flex justify-end gap-x-4">
          <Badge>{{ item.username }}</Badge>
          <Badge variant="outline" class="hidden sm:inline-flex">
            Updated at: {{ new Date(item.scrapedAt).toLocaleDateString() }}
          </Badge>
        </div>

        <div class="min-w-0 mt-16 sm:mt-24">
          <p class="text-xl sm:text-2xl font-semibold">
            {{ item.fullName ?? item.username }}
          </p>

          <p
            v-if="item.headline"
            class="mt-1 text-sm sm:text-base leading-snug"
          >
            {{ item.headline }}
          </p>
        </div>
      </CardContent>
    </NuxtLink>
    <Separator decorative />
    <CardFooter class="relative flex justify-between">
      <Button as-child variant="outline" size="icon">
        <NuxtLink
          :to="item.profileUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2"
        >
          <Icon name="mdi:linkedin" size="28" />
        </NuxtLink>
      </Button>
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Button
          as-child
          size="sm"
          variant="outline"
          class="rounded-full border-primary text-primary hover:bg-primary/10"
        >
          <NuxtLink
            :to="uploaderUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2"
            @click.stop
          >
            <Icon name="mdi:linkedin" size="16" />
            <span>{{ uploaderHandle }}</span>
          </NuxtLink>
        </Button>
      </div>
      <div class="flex items-center gap-2">
        <Button
          :variant="liked ? 'default' : 'outline'"
          size="sm"
          :disabled="likeLoading"
          class="gap-2"
          @click.stop.prevent="toggleLike"
        >
          <Icon
            :name="liked ? 'mdi:heart' : 'mdi:heart-outline'"
            :class="liked ? 'text-rose-500' : ''"
          />
          <span class="tabular-nums">{{ likeCount }}</span>
        </Button>
      </div>
    </CardFooter>
  </Card>
</template>
