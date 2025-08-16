import { NextRequest } from 'next/server';
import { connectToDatabase, ProductModel } from '@repo/db';
import { detectLanguage, needsTranslation } from '@repo/shared';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
	const body = await req.json().catch(()=>null) as { productId: string; to: string } | null;
	if (!body?.productId || !body?.to) return new Response('Bad Request', { status: 400 });
	await connectToDatabase().catch(()=>null);
	const product = await ProductModel.findById(body.productId).catch(()=>null) as any;
	if (!product) return new Response('Not Found', { status: 404 });
	const srcLang = detectLanguage(product.title?.en ?? Object.values(product.title ?? {})[0] ?? '');
	if (!needsTranslation(srcLang, body.to)) return Response.json({ ok: true, note: 'no translation needed' });
	product.translations = product.translations || {};
	product.translations[body.to] = { title: product.title?.en ?? '', description: product.description?.en ?? '', pdfKey: undefined };
	await product.save();
	return Response.json({ ok: true });
}