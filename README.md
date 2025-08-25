# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Who Made the Best Banner?

A Nuxt 3 app showcasing handpicked LinkedIn banners from top creators. Includes a LinkedIn-like profile layout and a simple like system backed by Turso (libSQL).

## Features
- Beautiful hero with search filtering by name, headline, and about
- LinkedIn-style profile card layout: fixed banner height (201px desktop, 160px md, 120px mobile), avatar overlap up to 200px
- Content-driven profiles from `content/profiles/*.json`
- Anonymous like system with cookie-based `liker_id`
- OG images via `nuxt-og-image`

## Tech Stack
- Nuxt 3, Vite
- Tailwind CSS (via Vite plugin)
- Nuxt Content
- shadcn-nuxt components
- nuxt-og-image
- Turso (libSQL) via `@libsql/client`

## Requirements
- Node or Bun (this repo includes `bun.lock` and uses Bun in examples)
- Turso database (or any libSQL-compatible endpoint)

## Quick Start
```bash
# Install
bun install

# Dev
bun run dev

# Build
bun run build

# Preview
bun run preview
```

## Environment Variables
Configure in your shell or a `.env` file. These are wired in `nuxt.config.ts` under `runtimeConfig`.
- `TURSO_DATABASE_URL` — Turso/libSQL database URL
- `TURSO_AUTH_TOKEN` — Turso auth token

The server utilities read them through `useRuntimeConfig()` in `server/utils/db.ts`.

## API Endpoints (Likes)
Base path: `/api/likes/:username`
- GET `/api/likes/{username}` → `{ count: number, liked: boolean }`
  - Creates an anonymous `liker_id` cookie if missing
- POST `/api/likes/{username}` → `{ count: number, liked: true }`
  - Idempotent insert; safe to call repeatedly
- DELETE `/api/likes/{username}` → `{ count: number, liked: false }`
  - No-op if the cookie is missing

Backed by `server/utils/db.ts`, which ensures the `likes` table and indexes on first use.

## Content Model
- Profiles live in `content/profiles/*.json`
- See `dev-docs/schema.ts` and examples in `dev-docs/collect-buddy/*.json`
- Add a new profile by adding a JSON file under `content/profiles/`

## Project Structure
- `app/` — components, assets, pages/layouts
- `content/` — profile JSON content
- `server/` — API routes and utilities (`/api/likes`)
- `public/` — static assets
- `nuxt.config.ts` — modules, runtimeConfig, meta

## Deployment
- Provide env vars (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`) on your host
- Build with `bun run build` and serve `.output/`
- Refer to Nuxt deployment guide below for platform specifics

---

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
