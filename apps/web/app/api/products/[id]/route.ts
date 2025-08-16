import { NextRequest } from 'next/server';

export const runtime = 'edge';

const mock = {
	id: 'p_1',
	slug: 'starter-pack',
	title: { en: 'Starter Pack', es: 'Paquete Inicial', fr: 'Pack de Démarrage' },
	description: { en: 'All you need to start.', es: 'Todo lo que necesitas para empezar.', fr: 'Tout ce dont vous avez besoin pour commencer.' },
	status: 'published',
	tags: ['AI', 'Toolkit']
};

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	const { searchParams } = new URL(req.url);
	const lang = (searchParams.get('lang') ?? 'en') as 'en'|'es'|'fr';
	// In real app, fetch by slug or id; here we return mock with fallback to en
	const product = {
		id: mock.id,
		slug: mock.slug,
		title: mock.title[lang] ?? mock.title.en,
		description: mock.description[lang] ?? mock.description.en,
		status: mock.status,
		tags: mock.tags
	};
	return Response.json(product);
}