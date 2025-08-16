import { NextRequest } from 'next/server';
import { connectToDatabase, GuildModel } from '@repo/db';

export const runtime = 'nodejs';

export async function GET() {
	await connectToDatabase().catch(()=>null);
	const guilds = await GuildModel.find().limit(50).lean().catch(()=>[]) as any[];
	return Response.json({ guilds: guilds.map(g => ({ id: g._id?.toString(), name: g.name, members: g.members?.length ?? 0 })) });
}

export async function POST(req: NextRequest) {
	const body = await req.json().catch(()=>null) as { name: string; description?: string; ownerId?: string } | null;
	if (!body?.name) return new Response('Bad Request', { status: 400 });
	await connectToDatabase().catch(()=>null);
	const doc = await GuildModel.create({ name: body.name, description: body.description, owners: body.ownerId ? [body.ownerId] : [], members: body.ownerId ? [body.ownerId] : [] });
	return Response.json({ id: doc._id?.toString() });
}