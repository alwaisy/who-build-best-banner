// Turso (libSQL) client using @libsql/client with runtime config
// Reads: runtimeConfig.tursoDatabaseUrl, runtimeConfig.tursoAuthToken
// Exposes a singleton client and ensures schema (likes table)

import { createClient, type Client } from '@libsql/client'
import { useRuntimeConfig } from '#imports'

let client: Client | null = null
let schemaReady = false

function getClient() {
  if (client) return client
  const rc = useRuntimeConfig()
  const url = rc.tursoDatabaseUrl as string | undefined
  const authToken = rc.tursoAuthToken as string | undefined
  if (!url || !authToken) {
    throw new Error('Missing runtimeConfig.tursoDatabaseUrl or tursoAuthToken')
  }
  client = createClient({ url, authToken })
  return client
}

export async function ensureSchema() {
  if (schemaReady) return
  const c = getClient()
  await c.execute(`CREATE TABLE IF NOT EXISTS likes (
    liker_id TEXT NOT NULL,
    profile_username TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
  )`)
  await c.execute(`CREATE UNIQUE INDEX IF NOT EXISTS idx_likes_unique ON likes (liker_id, profile_username)`)
  await c.execute(`CREATE INDEX IF NOT EXISTS idx_likes_profile ON likes (profile_username)`)
  schemaReady = true
}

export function db() {
  return getClient()
}
