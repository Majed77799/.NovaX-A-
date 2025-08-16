"use client";
import { Badge, Button, Card, Checkbox, Chip, Input, Pagination, Select, Switch, Tabs, Textarea, Tooltip } from '@repo/ui';
import { useState } from 'react';

export default function Design() {
	const [tab, setTab] = useState('t1');
	return (
		<div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
			<h1 className="text-2xl font-bold">Design System</h1>
			<div className="grid md:grid-cols-2 gap-4">
				<Card title="Buttons" interactive>
					<div className="flex gap-2 flex-wrap">
						<Button>Primary</Button>
						<Button variant="secondary">Secondary</Button>
						<Button variant="ghost">Ghost</Button>
						<Button variant="danger">Danger</Button>
					</div>
				</Card>
				<Card title="Inputs" interactive>
					<div className="grid gap-2">
						<Input placeholder="Your name" />
						<Textarea placeholder="Message" />
						<Select><option>Option</option></Select>
						<div className="flex items-center gap-3">
							<Checkbox label="Accept" />
							<Switch label="Enable" />
						</div>
					</div>
				</Card>
				<Card title="Display" interactive>
					<div className="flex items-center gap-2 flex-wrap">
						<Badge>Neutral</Badge>
						<Badge variant="primary">Primary</Badge>
						<Badge variant="success">Success</Badge>
						<Badge variant="warning">Warning</Badge>
						<Badge variant="danger">Danger</Badge>
						<Chip>Chip</Chip>
						<Tooltip label="Hello"><button className="px-2 py-1 border rounded">Hover</button></Tooltip>
					</div>
				</Card>
				<Card title="Navigation" interactive>
					<div className="space-y-3">
						<Tabs tabs={[{ id: 't1', label: 'Tab 1' }, { id: 't2', label: 'Tab 2' }]} value={tab} onChange={setTab} />
						<Pagination page={1} pageCount={5} onPageChange={() => {}} />
					</div>
				</Card>
			</div>
		</div>
	);
}