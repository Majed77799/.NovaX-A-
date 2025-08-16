import { Card } from '@repo/ui';

export default function AnalyticsPage() {
	return (
		<div className="grid md:grid-cols-3 gap-4">
			<Card title="Views" subtitle="Last 7 days"><div className="h-32 bg-black/5 rounded-md" /></Card>
			<Card title="CTR" subtitle="Last 7 days"><div className="h-32 bg-black/5 rounded-md" /></Card>
			<Card title="Sales" subtitle="Last 7 days"><div className="h-32 bg-black/5 rounded-md" /></Card>
			<Card className="md:col-span-3" title="Top sources"><div className="h-40 bg-black/5 rounded-md" /></Card>
		</div>
	);
}