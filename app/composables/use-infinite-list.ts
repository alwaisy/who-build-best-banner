import { computed, onBeforeUnmount, onMounted, ref, toValue, watch, type ComputedRef, type MaybeRefOrGetter, type Ref, type WatchSource } from "vue";

export type UseInfiniteListOptions = {
  pageSize?: number;
  resetOn?: WatchSource | WatchSource[];
  throttleMs?: number;
};

export type UseInfiniteListReturn<T> = {
  items: ComputedRef<T[]>;
  visibleItems: ComputedRef<T[]>;
  visibleCount: Ref<number>;
  canLoadMore: ComputedRef<boolean>;
  sentinel: Ref<HTMLElement | null>;
  loadMore: () => void;
  reset: () => void;
};

export function useInfiniteList<T>(
  source: MaybeRefOrGetter<readonly T[] | T[]>,
  opts: UseInfiniteListOptions = {}
): UseInfiniteListReturn<T> {
  const pageSize = opts.pageSize ?? 10;
  const throttleMs = opts.throttleMs ?? 150;

  const items = computed<T[]>(() => {
    const v = toValue(source) as readonly T[] | T[] | null | undefined;
    return (Array.isArray(v) ? v : []) as T[];
  });

  const visibleCount = ref(0);
  const visibleItems = computed<T[]>(() => items.value.slice(0, Math.min(visibleCount.value, items.value.length)));
  const canLoadMore = computed<boolean>(() => items.value.length > visibleCount.value);

  const sentinel = ref<HTMLElement | null>(null);
  let io: IntersectionObserver | null = null;
  let ticking = false;

  function loadMore() {
    if (!canLoadMore.value) return;
    visibleCount.value = Math.min(visibleCount.value + pageSize, items.value.length);
  }

  function reset() {
    visibleCount.value = Math.min(pageSize, items.value.length);
  }

  // Reset when items length changes or external reset signals change
  const resetSources: WatchSource[] = [() => items.value.length];
  if (opts.resetOn) {
    if (Array.isArray(opts.resetOn)) resetSources.push(...opts.resetOn);
    else resetSources.push(opts.resetOn);
  }
  watch(resetSources, () => reset(), { immediate: true });

  onMounted(() => {
    if (typeof window === "undefined") return;
    io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        if (!canLoadMore.value) return;
        if (ticking) return;
        ticking = true;
        loadMore();
        setTimeout(() => {
          ticking = false;
        }, throttleMs);
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );
    if (sentinel.value) io.observe(sentinel.value);
  });

  // Keep observer synced with element and ability to load more
  watch(sentinel, (el, prev) => {
    if (!io) return;
    if (prev) io.unobserve(prev as Element);
    if (el && canLoadMore.value) io.observe(el as Element);
  });

  watch(canLoadMore, (can) => {
    if (!io || !sentinel.value) return;
    if (can) io.observe(sentinel.value);
    else io.unobserve(sentinel.value);
  });

  onBeforeUnmount(() => {
    io?.disconnect();
    io = null;
  });

  return { items, visibleItems, visibleCount, canLoadMore, sentinel, loadMore, reset };
}
