import { NextRequest } from 'next/server';
import { signJwt, hashPassword } from '@repo/shared/auth';

export const runtime = 'edge';

// NOTE: Demo in-memory user fallback. Replace with database.
const DEMO_USER_EMAIL = process.env.DEMO_USER_EMAIL ?? 'demo@example.com';
const DEMO_USER_PASSWORD_HASH = process.env.DEMO_USER_PASSWORD_HASH ?? '';

export async function POST(req: NextRequest) {
	const { email, password } = await req.json().catch(() => ({}));
	if (!email || !password) return new Response('Bad Request', { status: 400 });
	let ok = false;
	if (DEMO_USER_PASSWORD_HASH) {
		const hp = await hashPassword(password);
		ok = email === DEMO_USER_EMAIL && hp === DEMO_USER_PASSWORD_HASH;
	} else {
		ok = email === DEMO_USER_EMAIL && password === (process.env.DEMO_USER_PASSWORD ?? 'password');
	}
	if (!ok) return new Response('Unauthorized', { status: 401 });
	const token = await signJwt({ userId: 'demo', email, premium: false, provider: 'password' });
	return Response.json({ token });
}