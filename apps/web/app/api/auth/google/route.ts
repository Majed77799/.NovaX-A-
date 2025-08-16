import { NextRequest } from 'next/server';
import { getGoogleAuthUrl } from '@repo/integrations';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
	const clientId = process.env.GOOGLE_CLIENT_ID;
	const redirectUri = process.env.GOOGLE_REDIRECT_URI;
	if (!clientId || !redirectUri) return new Response('Google not configured', { status: 500 });
	const url = getGoogleAuthUrl({ clientId, redirectUri, state: req.nextUrl.searchParams.get('state') ?? undefined });
	return Response.json({ url });
}