export const runtime = 'nodejs';

export async function GET() {
	return new Response(JSON.stringify({ ok: true, timestamp: new Date().toISOString() }), {
		headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
		status: 200
	});
}