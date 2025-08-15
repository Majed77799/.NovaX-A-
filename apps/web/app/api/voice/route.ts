export const runtime = 'nodejs';

export async function POST() {
	return new Response(JSON.stringify({ ok: false, error: 'Voice not implemented' }), {
		status: 501,
		headers: { 'Content-Type': 'application/json' }
	});
}