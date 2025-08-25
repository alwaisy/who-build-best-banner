import { queryCollection } from "#imports";
import { computed, ref, watch, type Ref } from "vue";
import type { Profile } from "~/lib/schema";

export type VersionEntry = { key: string; ver: number; profile: Profile };

// Find and list versions for a given username from @nuxt/content data collection
export async function fetchProfileVersions(username: string): Promise<VersionEntry[]> {
  const rows = await queryCollection("profiles").all();
  for (const row of rows as Array<Record<string, unknown>>) {
    const meta = (row as { meta?: Record<string, unknown> }).meta;
    const container = meta && typeof meta === "object"
      ? ((meta as { body?: Record<string, unknown> }).body && typeof (meta as { body?: Record<string, unknown> }).body === "object"
          ? ((meta as { body?: Record<string, unknown> }).body as Record<string, unknown>)
          : (meta as Record<string, unknown>))
      : undefined;

    if (!container || typeof container !== "object") continue;

    const entries = Object.entries(container)
      .map(([k, v]) => ({ k, v }))
      .filter(({ k, v }) => /^v\d+$/i.test(k) && v && typeof v === "object") as Array<{ k: string; v: Record<string, unknown> }>;

    const hit = entries.find(({ v }) => (v.username as string | undefined) === username);
    if (hit) {
      const list: VersionEntry[] = entries
        .map(({ k, v }) => ({ key: k, ver: Number(k.slice(1)), profile: v as unknown as Profile }))
        .sort((a, b) => b.ver - a.ver);
      return list;
    }
  }
  return [] as VersionEntry[];
}

// High-level composable to use on the profile page
export function useProfileVersions(username: Ref<string>) {
  const { data: versions } = useAsyncData(
    () => `profile:versions:${username.value}`,
    () => fetchProfileVersions(username.value),
    { server: true, default: () => [] as VersionEntry[] }
  );

  const currentVersion = ref<string | null>(null);

  // Initialize to latest when versions load
  watch(versions, (v) => {
    if (!currentVersion.value) currentVersion.value = v?.[0]?.key ?? null;
  }, { immediate: true });

  const selected = computed<Profile>(() => {
    const key = currentVersion.value;
    const found = key ? versions.value.find((v) => v.key === key) : undefined;
    return found?.profile as Profile | undefined as unknown as Profile;
  });

  return { versions, currentVersion, selected } as const;
}
