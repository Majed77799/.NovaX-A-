import { NextRequest, NextResponse } from 'next/server';
import { exchangeGoogleCode, fetchGoogleUserInfo } from '@repo/integrations';
import { signJwt } from '@repo/shared/auth';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
	const code = req.nextUrl.searchParams.get('code');
	if (!code) return new Response('Bad Request', { status: 400 });
	const clientId = process.env.GOOGLE_CLIENT_ID!;
	const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
	const redirectUri = process.env.GOOGLE_REDIRECT_URI!;
	if (!clientId || !clientSecret || !redirectUri) return new Response('Google not configured', { status: 500 });
	const tokens = await exchangeGoogleCode({ clientId, clientSecret, redirectUri, code });
	const info = await fetchGoogleUserInfo(tokens.id_token);
	const email = info?.email ?? undefined;
	const sub = info?.sub ?? 'google-user';
	const token = await signJwt({ userId: sub, email, premium: false, provider: 'google' });
	const target = new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000');
	target.pathname = '/login';
	target.hash = `token=${encodeURIComponent(token)}`;
	return NextResponse.redirect(target);
}