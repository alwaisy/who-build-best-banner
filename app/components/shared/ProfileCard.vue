<script setup lang="ts">
import Autoplay from "embla-carousel-autoplay";
import type { Profile } from "~/lib/schema";
import type { UnwrapRefCarouselApi } from '~/components/ui/carousel/interface';

const props = defineProps<{ item: Profile }>();

// Normalize array of banners for carousel
const banners = computed<string[]>(() => {
  const b = props.item.bannerImageUrl as string | string[] | null;
  if (!b) return [];
  return Array.isArray(b) ? b.filter(Boolean) : [b];
});

// Likes state
const likeCount = ref(0);
const liked = ref(false);
const likeLoading = ref(false);

// Uploader (author) link: prefer item.uploaderLinkedin else fallback to alwaisy
const uploaderUrl = computed(() => {
  const fromContent = props.item.uploaderLinkedin ?? undefined;
  if (fromContent && fromContent.startsWith("http")) return fromContent;
  return "https://www.linkedin.com/in/alwaisy";
});

const uploaderHandle = computed(() => {
  try {
    const url = new URL(uploaderUrl.value);
    // Expect /in/<username>
    const parts = url.pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("in");
    const handle =
      idx >= 0 && parts[idx + 1] ? parts[idx + 1] : parts[parts.length - 1];
    return `@${handle}`;
  } catch {
    return "@uploader";
  }
});

onMounted(async () => {
  try {
    const res = await $fetch<{ count: number; liked: boolean }>(
      `/api/likes/${props.item.username}`
    );
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
    const res = await $fetch<{ count: number; liked: boolean }>(
      `/api/likes/${props.item.username}`,
      {
        method: wasLiked ? "DELETE" : "POST",
      }
    );
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

const currentIndex = ref(0);
const carouselApi = ref<UnwrapRefCarouselApi | null>(null);

function handleCarouselInit(api: UnwrapRefCarouselApi) {
  carouselApi.value = api;
  currentIndex.value = api?.selectedScrollSnap() ?? 0;
  
  api?.on('select', () => {
    currentIndex.value = api?.selectedScrollSnap() ?? 0;
  });
}

function goToSlide(i: number) {
  if (carouselApi.value) {
    carouselApi.value.scrollTo(i);
  }
}
</script>

<template>
  <Card style="padding-top: 0">
    <div class="w-full rounded-t-xl overflow-hidden relative">
      <template v-if="banners.length === 0">
        <div class="h-[300px] w-full bg-muted" />
      </template>
      <template v-else-if="banners.length === 1">
        <!-- Single image - no carousel needed -->
        <NuxtLink
          v-umami="{
            name: 'profile_card_click',
            username: item.username,
            source: 'banner_image',
            location: 'profile_card'
          }"
          :to="`/in/${item.username}`"
          class="block"
          view-transition
        >
          <img
            :src="banners[0]"
            :alt="(item.fullName ?? item.username) + ' banner'"
            class="block w-full object-cover object-center rounded-t-xl"
            :style="{ viewTransitionName: `banner-${item.username}0` }"
            loading="lazy"
          />
        </NuxtLink>
      </template>
      <template v-else>
        <!-- Multiple images - show carousel -->
        <ClientOnly>
          <Carousel
            :plugins="[
              Autoplay({
                delay: 3000,
                stopOnMouseEnter: true,
              }),
            ]"
            @init-api="handleCarouselInit"
          >
            <CarouselContent>
              <CarouselItem v-for="(src, idx) in banners" :key="src + idx">
                <NuxtLink
                  v-umami="{
                    name: 'profile_card_click',
                    username: item.username,
                    source: 'banner_image',
                    location: 'profile_card'
                  }"
                  :to="`/in/${item.username}`"
                  class="block"
                  view-transition
                >
                  <img
                    :src="src"
                    :alt="(item.fullName ?? item.username) + ' banner'"
                    class="block w-full object-cover object-center rounded-t-xl"
                    :style="{ viewTransitionName: `banner-${item.username + idx}` }"
                    loading="lazy"
                  />
                </NuxtLink>
              </CarouselItem>
            </CarouselContent>
            <!-- Navigation dots with directional indicators -->
            <div class="absolute top-3 right-3 z-10">
              <div
                class="flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur px-2 py-1 border border-white/10"
              >
                <button
                  v-for="(_, i) in banners"
                  :key="'dot-' + i"
                  class="transition-all duration-200"
                  :class="
                    i === currentIndex
                      ? 'w-6 h-2 rounded-full bg-white'
                      : 'w-2.5 h-2.5 rounded-full bg-white/70 hover:bg-white/90'
                  "
                  :aria-current="i === currentIndex ? 'true' : 'false'"
                  :aria-label="`Go to slide ${i + 1}`"
                  @click.stop.prevent="goToSlide(i)"
                />
              </div>
            </div>
          </Carousel>
        </ClientOnly>
      </template>
    </div>

    <NuxtLink 
      v-umami="{
        name: 'profile_card_click',
        username: item.username,
        source: 'card_body',
        location: 'profile_card'
      }" 
      :to="`/in/${item.username}`"
      view-transition
    >
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
          <template v-if="item.isProvider">
            <Badge variant="default">LinkedIn Service</Badge>
          </template>
          <template v-else>
            <Badge>{{ item.username }}</Badge>
            <Badge variant="outline" class="hidden sm:inline-flex">
              Updated at: {{ new Date(item.scrapedAt).toLocaleDateString() }}
            </Badge>
          </template>
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
          v-umami="{
            name: 'external_link_click',
            username: item.username,
            destination: 'linkedin_profile',
            location: 'profile_card'
          }"
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
            v-umami="{
              name: 'external_link_click',
              username: item.username,
              destination: 'uploader_profile',
              uploader_handle: uploaderHandle,
              location: 'profile_card'
            }"
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
          v-umami="{
            name: 'like_toggle',
            username: item.username,
            action: liked ? 'unlike' : 'like',
            location: 'profile_card'
          }"
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
