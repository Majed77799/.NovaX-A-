import './lib/db.js';
import { upsertTemplate } from './lib/db.js';

const samples = [
	{
		id: 'tpl_1',
		title: 'Starter Landing Page',
		description: 'Beautiful responsive landing page template.',
		price_cents: 1900,
		badge: 'Popular',
		featured: 1,
		trending_score: 85,
		pinned: 1,
		file_url: 'https://example.com/downloads/starter-landing.zip',
		thumbnail_url: '',
		provider: 'local',
		active: 1,
	},
	{
		id: 'tpl_2',
		title: 'Portfolio UI Kit',
		description: 'Components for personal portfolios.',
		price_cents: 990,
		badge: 'New',
		featured: 0,
		trending_score: 50,
		pinned: 0,
		file_url: 'https://example.com/downloads/portfolio-kit.zip',
		thumbnail_url: '',
		provider: 'local',
		active: 1,
	},
];

for (const s of samples) upsertTemplate(s);

console.log('Seeded', samples.length, 'templates');