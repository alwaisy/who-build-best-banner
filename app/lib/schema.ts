import { z } from "zod";

export const ProfileSchema = z.object({
  username: z.string(),
  profileUrl: z.string().url(),
  fullName: z.string().nullable(),
  headline: z.string().nullable(),
  about: z.string().nullable(),
  uploaderLinkedin: z.string().url().nullable().optional(),
  bannerImageUrl: z
    .union([z.string().url(), z.array(z.string().url())])
    .nullable(),
  profileImageUrl: z.string().url().nullable(),
  scrapedAt: z.string(),
});

export type Profile = z.infer<typeof ProfileSchema>;
