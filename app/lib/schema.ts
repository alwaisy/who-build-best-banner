import { z } from "zod";

export const ProfileSchema = z.object({
  username: z.string(),
  profileUrl: z.string().url(),
  fullName: z.string().nullable(),
  headline: z.string().nullable(),
  about: z.string().nullable(),
  // Indicates if this profile is a provider account; optional for backward compatibility
  isProvider: z.boolean().optional(),
  uploaderLinkedin: z.string().url().nullable().optional(),
  bannerImageUrl: z
    .union([z.string().url(), z.array(z.string().url())])
    .nullable(),
  profileImageUrl: z.string().url().nullable(),
  scrapedAt: z.string(),
});

export type Profile = z.infer<typeof ProfileSchema>;

// Versioned document: keys like "v1", "v2", ... each containing a flat ProfileSchema
// We allow arbitrary string keys to keep it flexible, but runtime will pick keys matching /^v\d+$/
export const VersionedProfileSchema = z.object({}).catchall(ProfileSchema);

export type VersionedProfile = z.infer<typeof VersionedProfileSchema>;
