export const runtime = 'nodejs';

export async function POST() {
	return new Response(JSON.stringify({ ok: false, error: 'Translation not implemented' }), {
		status: 501,
		headers: { 'Content-Type': 'application/json' }
	});
}