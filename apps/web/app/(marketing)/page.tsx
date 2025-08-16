"use client";
import { Button, Card, Chip, Orb } from '@repo/ui';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Landing() {
	return (
		<div className="ui-gradient">
			<section className="mx-auto max-w-6xl px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
				<div>
					<motion.h1 className="text-4xl md:text-6xl font-extrabold tracking-tight" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
						Create, market, and sell AI-native products.
					</motion.h1>
					<p className="mt-4 text-lg text-[color:var(--color-text-muted)]">NovaX brings a premium toolkit: explore trending content, launch products, generate marketing assets, and optimize pricing—beautifully.</p>
					<div className="mt-6 flex items-center gap-3">
						<Link href="/(app)/explore"><Button size="lg">Start exploring</Button></Link>
						<Link href="/(app)/dashboard"><Button size="lg" variant="secondary">Open dashboard</Button></Link>
					</div>
					<div className="mt-6 flex gap-2 flex-wrap">
						<Chip>Pastel gradients</Chip>
						<Chip>Glassy layers</Chip>
						<Chip>Soft shadows</Chip>
						<Chip>WCAG AA</Chip>
					</div>
				</div>
				<div className="flex justify-center">
					<Orb state="pulse" size={160} className="" />
				</div>
			</section>
			<section className="mx-auto max-w-6xl px-4 grid md:grid-cols-3 gap-6 pb-16">
				<Card title="Personalized feed" subtitle="For you and Trending" interactive>
					Browse vertical content with smooth likes, comments, and quick add-to-cart.
				</Card>
				<Card title="Product engine" subtitle="Draft → publish in minutes" interactive>
					Upload files, set dynamic pricing, and publish with confidence.
				</Card>
				<Card title="Marketing generate" subtitle="Streamed assets in your tone" interactive>
					Audience, tone, and language-aware content with token cost estimate.
				</Card>
			</section>
			<section className="mx-auto max-w-6xl px-4 pb-20">
				<div className="grid md:grid-cols-2 gap-6">
					<Card title="Loved by creators" subtitle="2,000+ early users">
						“Finally, a polished stack that makes AI products feel premium.”
					</Card>
					<Card title="Pricing teaser" subtitle="Simple and fair">
						Get started free. Upgrade to AI subscription for the full experience.
					</Card>
				</div>
			</section>
		</div>
	);
}