import { NextRequest } from 'next/server';
import { prisma } from '@repo/db';
import { createSignedUrl } from '@repo/shared';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const saleId = searchParams.get('saleId');
	if (!saleId) return new Response('Bad Request', { status: 400 });
	const job = await prisma.watermarkJob.findUnique({ where: { saleId } });
	if (!job || job.status !== 'DONE' || !job.resultUrl) return new Response('Not Ready', { status: 409 });
	const secret = process.env.DOWNLOAD_SIGNING_SECRET ?? 'dev_secret';
	const url = createSignedUrl(job.resultUrl, secret, 300);
	return Response.json({ url });
}