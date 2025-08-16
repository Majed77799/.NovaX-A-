import Link from 'next/link';
import { Card, EmptyState } from '@repo/ui';

export default function DashboardHome() {
	return (
		<div className="grid gap-4">
			<div className="grid md:grid-cols-3 gap-4">
				<Card title="Products" subtitle="Manage and publish" interactive footer={<Link href="/(app)/dashboard/products" className="text-sm">Open →</Link>}>
					<EmptyState title="No products yet" description="Create your first product to start selling." />
				</Card>
				<Card title="Marketing" subtitle="Generate assets" interactive footer={<Link href="/(app)/dashboard/marketing" className="text-sm">Open →</Link>}>
					<EmptyState title="No campaigns" description="Generate content tailored to your audience." />
				</Card>
				<Card title="Analytics" subtitle="Views and sales" interactive footer={<Link href="/(app)/dashboard/analytics" className="text-sm">Open →</Link>}>
					<EmptyState title="No data yet" description="Come back after your first publish." />
				</Card>
			</div>
		</div>
	);
}