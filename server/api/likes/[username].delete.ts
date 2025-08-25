import { defineEventHandler, getCookie, createError } from 'h3'
import { db, ensureSchema } from '../../utils/db'

export default defineEventHandler(async (event) => {
  await ensureSchema()
  const username = event.context.params?.username
  if (!username) {
    throw createError({ statusCode: 400, statusMessage: 'username required' })
  }

  const likerId = getCookie(event, 'liker_id')
  if (!likerId) {
    // Nothing to delete if we don't know liker
    return { count: await getCount(username), liked: false }
  }

  const client = db()
  await client.execute({
    sql: 'DELETE FROM likes WHERE profile_username = ?1 AND liker_id = ?2',
    args: [username, likerId],
  })

  const count = await getCount(username)
  return { count, liked: false }
})

async function getCount(username: string) {
  const client = db()
  const res = await client.execute({
    sql: 'SELECT COUNT(*) AS count FROM likes WHERE profile_username = ?1',
    args: [username],
  })
  return Number(res.rows[0]?.count ?? 0)
}
