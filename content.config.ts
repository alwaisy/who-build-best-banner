import { defineCollection, defineContentConfig } from '@nuxt/content'
import { VersionedProfileSchema } from './app/lib/schema'

// Nuxt Content v3 Collections configuration
// See local docs: dev-docs/nuxt-content-docs/docs/2.collections/1.define.md

export default defineContentConfig({
  collections: {
    profiles: defineCollection({
      // JSON-only data documents
      type: 'data',
      // Only include JSON files inside content/profiles
      source: {
        include: 'profiles/*.json',
      },
      // Reuse app-level Zod schema (single source of truth)
      schema: VersionedProfileSchema
    })
  }
})
