export type Product = {
	id: string;
	title: string;
	description: string;
	price: number;
	image: string;
	badge?: 'New' | 'Hot' | 'Free';
	category: string;
};

export type UserProfile = {
	id: string;
	name: string;
	avatar: string;
	stats: { sales: number; earnings: number; followers: number };
	badges: string[];
};

export const products: Product[] = [
	{ id: 'p1', title: 'Neon UI Kit', description: 'Figma UI Kit with 120+ components', price: 29, image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1400&auto=format&fit=crop', badge: 'New', category: 'UI Kits' },
	{ id: 'p2', title: 'Gradient Wallpapers', description: '50 dreamy pastel gradients', price: 12, image: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?q=80&w=1400&auto=format&fit=crop', badge: 'Hot', category: 'Wallpapers' },
	{ id: 'p3', title: 'Startup Pitch Deck', description: 'Bold, modern pitch deck', price: 19, image: 'https://images.unsplash.com/photo-1541844053589-346841d0aa7e?q=80&w=1400&auto=format&fit=crop', category: 'Templates' },
	{ id: 'p4', title: 'Icon Pack - Pastel', description: '480 icons, phos inspired', price: 0, image: 'https://images.unsplash.com/photo-1551281044-8c5f6bb9b1ae?q=80&w=1400&auto=format&fit=crop', badge: 'Free', category: 'Icons' }
];

export const freebies: Product[] = products.filter(p => (p.price ?? 0) === 0);

export const user: UserProfile = {
	id: 'u1',
	name: 'Nova Creator',
	avatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=1400&auto=format&fit=crop',
	stats: { sales: 1542, earnings: 42190, followers: 8921 },
	badges: ['Top Seller', 'Community Builder', 'Early Nova']
};