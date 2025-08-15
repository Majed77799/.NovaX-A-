export const runtime = 'edge';

const headers = {
	'Access-Control-Allow-Origin': process.env.NOVAX_CORS_ORIGIN ?? '*',
	'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization',
	'Cache-Control': 'no-store'
};

export async function GET() {
	return Response.json({ ok: true }, { headers });
}

export async function OPTIONS() {
	return new Response(null, { status: 204, headers });
}