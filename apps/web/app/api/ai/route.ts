import { NextRequest } from 'next/server'

export const runtime = 'edge'
const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		const res = await fetch(`${apiUrl}/ai/chat`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body),
		})
		return new Response(await res.text(), { status: res.status, headers: { 'content-type': 'application/json' } })
	} catch (e) {
		return Response.json({ role: 'assistant', content: 'Mock reply (proxy failed)' })
	}
}