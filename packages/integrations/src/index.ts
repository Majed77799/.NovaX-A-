import Stripe from 'stripe';

export async function constructStripeEvent(rawBody: string, signature: string | null, secret: string) {
	if (!signature) throw new Error('Missing signature');
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' as any });
	return stripe.webhooks.constructEvent(rawBody, signature, secret);
}

export async function verifyGumroadLicense(licenseKey: string, productPermalink?: string) {
	const form = new URLSearchParams();
	form.set('license_key', licenseKey);
	if (productPermalink) form.set('product_permalink', productPermalink);
	const res = await fetch('https://api.gumroad.com/v2/licenses/verify', { method: 'POST', body: form as any });
	if (!res.ok) throw new Error('Failed to verify gumroad license');
	return res.json();
}

export function getGoogleAuthUrl({ clientId, redirectUri, scope = 'openid email profile', state }: { clientId: string; redirectUri: string; scope?: string; state?: string }) {
	const params = new URLSearchParams({
		client_id: clientId,
		redirect_uri: redirectUri,
		response_type: 'code',
		scope,
		access_type: 'offline',
		prompt: 'consent'
	});
	if (state) params.set('state', state);
	return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeGoogleCode({ clientId, clientSecret, redirectUri, code }: { clientId: string; clientSecret: string; redirectUri: string; code: string }) {
	const params = new URLSearchParams({
		client_id: clientId,
		client_secret: clientSecret,
		redirect_uri: redirectUri,
		grant_type: 'authorization_code',
		code
	});
	const res = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params.toString() });
	if (!res.ok) throw new Error('google token exchange failed');
	return res.json() as Promise<{ access_token: string; id_token: string; refresh_token?: string; expires_in: number }>;
}

export async function fetchGoogleUserInfo(idToken: string) {
	// The ID token is a JWT; for simplicity we can decode client-side, but here we call userinfo endpoint using access token typically.
	// If only idToken is available, return null to avoid complexity.
	try {
		const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString('utf-8'));
		return { email: payload.email as string | undefined, sub: payload.sub as string, name: payload.name as string | undefined };
	} catch {
		return null;
	}
}