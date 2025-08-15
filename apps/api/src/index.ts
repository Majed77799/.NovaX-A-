import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'

const app = new Hono()
app.use('*', cors())

app.get('/health', (c) => c.json({ ok: true }))

app.post('/ai/chat', async (c) => {
	try {
		const body = await c.req.json()
		const messages = (body?.messages ?? []) as { role: string; content: string }[]
		const last = messages[messages.length - 1]
		return c.json({ role: 'assistant', content: `Echo: ${last?.content ?? ''}` })
	} catch (e) {
		return c.json({ error: 'bad_request' }, 400)
	}
})

app.post('/ai/image', async (c) => {
	try {
		const body = await c.req.json()
		const prompt = String(body?.prompt ?? '')
		const svg = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512'><rect width='100%' height='100%' fill='lightgray'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='24'>${encodeURIComponent(
			prompt,
		)}</text></svg>`
		return c.json({ url: svg })
	} catch (e) {
		return c.json({ error: 'bad_request' }, 400)
	}
})

const port = Number(process.env.PORT ?? 4000)
export default app

if (process.env.VERCEL !== '1') {
	serve({ fetch: app.fetch, port })
	console.log(`API listening on http://localhost:${port}`)
}