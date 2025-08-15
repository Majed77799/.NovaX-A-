export const runtime = 'nodejs';

export async function POST() {
	return new Response(JSON.stringify({ ok: false, error: 'Image generation not implemented' }), {
		status: 501,
		headers: { 'Content-Type': 'application/json' }
	});
}