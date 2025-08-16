import { jwtVerify, SignJWT } from 'jose';
import { NextRequest } from 'next/server';

export type UserToken = { userId: string; email?: string; premium?: boolean; provider?: string; iat?: number; exp?: number };

export async function signJwt(payload: Omit<UserToken, 'iat'|'exp'>, expiresInSec = 60 * 60 * 24 * 7) {
	const secret = process.env.AUTH_JWT_SECRET;
	if (!secret) throw new Error('AUTH_JWT_SECRET missing');
	const key = new TextEncoder().encode(secret);
	const now = Math.floor(Date.now() / 1000);
	return await new SignJWT({ ...payload, iat: now })
		.setProtectedHeader({ alg: 'HS256' })
		.setExpirationTime(now + expiresInSec)
		.sign(key);
}

export async function verifyJwt(token: string): Promise<UserToken | null> {
	try {
		const secret = process.env.AUTH_JWT_SECRET;
		if (!secret) return null;
		const key = new TextEncoder().encode(secret);
		const { payload } = await jwtVerify(token, key);
		return payload as unknown as UserToken;
	} catch {
		return null;
	}
}

export async function hashPassword(password: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(password + (process.env.AUTH_PASSWORD_SALT ?? ''));
	const digest = await crypto.subtle.digest('SHA-256', data);
	const bytes = Array.from(new Uint8Array(digest));
	return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	const h = await hashPassword(password);
	return h === hash;
}

export function getBearerTokenFromRequest(req: NextRequest): string | null {
	const auth = req.headers.get('authorization') ?? '';
	const token = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : '';
	return token || null;
}

export async function getUserFromRequest(req: NextRequest): Promise<UserToken | null> {
	const token = getBearerTokenFromRequest(req);
	if (!token) return null;
	return verifyJwt(token);
}