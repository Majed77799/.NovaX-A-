import { NextRequest } from 'next/server';
import { connectToDatabase, SocialActionModel } from '@repo/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
	const body = await req.json().catch(()=>null) as { actorId?: string; targetType: 'product'|'user'|'guild'|'comment'; targetId: string; action: 'like'|'comment'|'follow'|'share'|'affiliate_click'; commentText?: string } | null;
	if (!body?.targetId || !body?.action || !body?.targetType) return new Response('Bad Request', { status: 400 });
	await connectToDatabase().catch(()=>null);
	const doc = await SocialActionModel.create({ actorId: body.actorId ?? 'anon', targetType: body.targetType, targetId: body.targetId, action: body.action, commentText: body.commentText });
	return Response.json({ ok: true, id: doc._id?.toString() });
}