import { defineEventHandler, getCookie, setCookie, createError } from 'h3'
import { db, ensureSchema } from '../../utils/db'

export default defineEventHandler(async (event) => {
  await ensureSchema()
  const username = event.context.params?.username
  if (!username) {
    throw createError({ statusCode: 400, statusMessage: 'username required' })
  }

  // ensure anonymous liker id via cookie
  let likerId = getCookie(event, 'liker_id')
  if (!likerId) {
    likerId = crypto.randomUUID()
    setCookie(event, 'liker_id', likerId, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    })
  }

  const client = db()
  const countRes = await client.execute({
    sql: 'SELECT COUNT(*) AS count FROM likes WHERE profile_username = ?1',
    args: [username],
  })
  const count = Number(countRes.rows[0]?.count ?? 0)

  const likedRes = await client.execute({
    sql: 'SELECT 1 AS liked FROM likes WHERE profile_username = ?1 AND liker_id = ?2 LIMIT 1',
    args: [username, likerId],
  })
  const liked = likedRes.rows.length > 0

  return { count, liked }
})
