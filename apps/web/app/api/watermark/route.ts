import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase, WatermarkModel, OrderModel } from '@repo/db';

export const runtime = 'nodejs';

function watermarkHash(orderId: string, buyerId: string, assetKey: string) {
	return crypto.createHash('sha256').update(`${orderId}:${buyerId}:${assetKey}`).digest('hex');
}

export async function POST(req: NextRequest) {
	const body = await req.json().catch(()=>null) as { orderId: string; assetKey?: string } | null;
	if (!body?.orderId) return new Response('Bad Request', { status: 400 });
	await connectToDatabase().catch(()=>null);
	const order = await OrderModel.findById(body.orderId).lean().catch(()=>null) as any;
	if (!order || order.status !== 'paid') return new Response('Forbidden', { status: 403 });
	const assetKey = body.assetKey ?? 'default';
	const hash = watermarkHash(order._id?.toString(), order.buyerId, assetKey);
	await WatermarkModel.updateOne({ watermarkHash: hash }, { $setOnInsert: { orderId: order._id?.toString(), buyerId: order.buyerId, assetKey, watermarkHash: hash } }, { upsert: true });
	return Response.json({ ok: true, watermarkHash: hash });
}