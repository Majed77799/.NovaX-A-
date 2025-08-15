import type { NextApiRequest, NextApiResponse } from 'next';

const API_BASE = process.env.API_BASE || 'http://localhost:4000';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const r = await fetch(`${API_BASE}/translate`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(req.body)
	});
	const data = await r.json();
	res.status(r.status).json(data);
}