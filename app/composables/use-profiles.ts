import type { Profile } from '~/lib/schema'

// Fetch all profiles from @nuxt/content (profiles collection)
export async function fetchProfiles(): Promise<Profile[]> {
  // queryCollection is designed for server usage, but in Nuxt 4 you can call it in server context.
  // For client usage, prefer useAsyncData wrapping queryContent('profiles').find().
  const items = await queryCollection('profiles').all()
  // items are typed by Zod schema from content.config.ts; cast to Profile for app-local typing parity
  return items as unknown as Profile[]
}

// Lightweight client-side search over name/headline/about
export function filterProfiles(items: Profile[], q: string): Profile[] {
  if (!q) return items
  const s = q.toLowerCase()
  return items.filter((p) =>
    (p.fullName ?? '').toLowerCase().includes(s) ||
    (p.headline ?? '').toLowerCase().includes(s) ||
    (p.about ?? '').toLowerCase().includes(s)
  )
}
