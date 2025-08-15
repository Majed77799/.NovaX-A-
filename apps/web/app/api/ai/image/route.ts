import { NextRequest } from 'next/server'

export const runtime = 'edge'
const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		const res = await fetch(`${apiUrl}/ai/image`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body),
		})
		return new Response(await res.text(), { status: res.status, headers: { 'content-type': 'application/json' } })
	} catch (e) {
		return Response.json({ url: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><rect width='100%' height='100%' fill='lightgray'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='18'>Mock</text></svg>` })
	}
}