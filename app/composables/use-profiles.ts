import { queryCollection } from "#imports";
import type { Profile } from "~/lib/schema";

// Fetch all profiles from @nuxt/content (profiles collection)
export async function fetchProfiles(): Promise<Profile[]> {
  // queryCollection returns versioned documents now, e.g. { v1: Profile, v2: Profile, ... }
  const items = await queryCollection("profiles").all();

  // Helper: pick the latest version (highest numeric vN) from a versioned record
  function latestVersion(rec: Record<string, unknown>): Profile | null {
    const entries = Object.entries(rec)
      .map(([k, v]) => {
        const m = /^v(\d+)$/i.exec(k);
        return m ? { ver: Number(m[1]), key: k, val: v } : null;
      })
      .filter((x): x is { ver: number; key: string; val: unknown } => !!x);

    if (!entries.length) return null;
    const max = entries.reduce((a, b) => (b.ver > a.ver ? b : a));
    return max.val as Profile;
  }

  const normalized: Profile[] = [];
  if (Array.isArray(items)) {
    for (const raw of items as Array<Record<string, unknown>>) {
      let picked: Profile | null = null;

      // Case 0: via meta, which is how @nuxt/content data items surface their payload
      const meta = (raw as { meta?: Record<string, unknown> }).meta;
      if (!picked && meta && typeof meta === "object") {
        // Try meta.vN keys first
        picked = latestVersion(meta);
        if (!picked) {
          // Fall back to meta.body being either a versioned record or a flat profile
          const body = (meta as { body?: Record<string, unknown> }).body;
          if (body && typeof body === "object") {
            picked = latestVersion(body) ?? (
              ["username", "profileUrl", "scrapedAt"].every((k) => Object.prototype.hasOwnProperty.call(body, k))
                ? (body as unknown as Profile)
                : null
            );
          }
        }
      }

      // Case 1: versioned record like { v1: {...}, v2: {...} }
      if (!picked) picked = latestVersion(raw);

      // Case 2: flat profile object (no vN keys)
      if (!picked) {
        const keys = Object.keys(raw);
        const looksLikeProfile = ["username", "profileUrl", "scrapedAt"].every((k) => keys.includes(k));
        if (looksLikeProfile) {
          picked = raw as unknown as Profile;
        }
      }

      // Case 3: nested under a known key (defensive)
      if (!picked) {
        // e.g., { data: { v1: {...} } } or { data: { ...flat } }
        const data = (raw as { data?: Record<string, unknown> }).data;
        if (data && typeof data === "object") {
          picked = latestVersion(data);
          if (!picked) {
            const keys = Object.keys(data);
            const looksLikeProfile = ["username", "profileUrl", "scrapedAt"].every((k) => keys.includes(k));
            if (looksLikeProfile) picked = data as unknown as Profile;
          }
        }
      }

      if (picked) normalized.push(picked);
    }
  }

  return normalized;
}

// Lightweight client-side search over name/headline/about
export function filterProfiles(items: Profile[], q: string): Profile[] {
  if (!q) return items;
  const s = q.toLowerCase();
  return items.filter(
    (p) =>
      (p.fullName ?? "").toLowerCase().includes(s) ||
      (p.headline ?? "").toLowerCase().includes(s) ||
      (p.about ?? "").toLowerCase().includes(s)
  );
}

