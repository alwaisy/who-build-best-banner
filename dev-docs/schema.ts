import { object, string, nullable, pipe, url, InferOutput, union, array } from 'valibot';

// Minimal profile schema per v1 requirements
export const ProfileSchema = object({
  username: string(),
  profileUrl: pipe(string(), url()),
  fullName: nullable(string()),
  headline: nullable(string()),
  about: nullable(string()),
  bannerImageUrl: nullable(
    union([
      pipe(string(), url()),
      array(pipe(string(), url())),
    ])
  ),
  profileImageUrl: nullable(pipe(string(), url())),
  scrapedAt: string(),
});

export type Profile = InferOutput<typeof ProfileSchema>;
