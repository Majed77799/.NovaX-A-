import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
	const { recipients } = await req.json().catch(() => ({}));
	if (!Array.isArray(recipients) || !recipients.length) return new Response('Bad Request', { status: 400 });
	// recipients: [{ address, share }] shares sum to 10000 (100%) basis points
	const web3 = (process.env.WEB3_ENABLED || '').toLowerCase() === 'true';
	if (web3) {
		// Return a deployment plan using our Solidity template PaymentSplitter-like contract
		return Response.json({ mode: 'web3', network: process.env.WEB3_NETWORK || 'sepolia', contract: 'RoyaltyDistributor.sol', action: 'deploy', recipients });
	}
	// Fallback: server-calculated split for accounting
	const total = 100000; // cents
	const payouts = recipients.map((r: any) => ({ address: r.address, amountCents: Math.floor(total * (r.share/10000)) }));
	return Response.json({ mode: 'server', payouts });
}