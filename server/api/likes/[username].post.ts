import { defineEventHandler, getCookie, setCookie, createError } from 'h3'
import { db, ensureSchema } from '../../utils/db'

export default defineEventHandler(async (event) => {
  await ensureSchema()
  const username = event.context.params?.username
  if (!username) {
    throw createError({ statusCode: 400, statusMessage: 'username required' })
  }

  let likerId = getCookie(event, 'liker_id')
  if (!likerId) {
    likerId = crypto.randomUUID()
    setCookie(event, 'liker_id', likerId, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    })
  }

  const client = db()
  // Try insert; ignore if already exists (unique constraint)
  try {
    await client.execute({
      sql: 'INSERT INTO likes (liker_id, profile_username) VALUES (?1, ?2)',
      args: [likerId, username],
    })
  } catch {
    // unique constraint violation -> ignore
  }

  const countRes = await client.execute({
    sql: 'SELECT COUNT(*) AS count FROM likes WHERE profile_username = ?1',
    args: [username],
  })
  const count = Number(countRes.rows[0]?.count ?? 0)

  return { count, liked: true }
})
