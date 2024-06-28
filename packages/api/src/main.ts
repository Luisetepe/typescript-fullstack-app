import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { env } from './env'

const app = new Hono()

app.get('/api/hello', async (c) => {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return c.json({ message: 'Hello Hono!' })
})

app.use('/*', serveStatic({ root: './static' }))
app.use('*', serveStatic({ path: './static/index.html' }))

export default {
  port: env.PORT,
  fetch: app.fetch,
}
