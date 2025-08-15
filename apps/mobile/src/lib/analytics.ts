import AsyncStorage from '@react-native-async-storage/async-storage';

export type AnalyticsEventType =
	| 'product_created'
	| 'exported'
	| 'ai_user'
	| 'ai_assistant'
	| 'sale_stripe'
	| 'sale_gumroad';

export type AnalyticsEvent = {
	id: string;
	type: AnalyticsEventType;
	timestamp: number;
	productType?: string;
	salesChannel?: 'stripe'|'gumroad'|'other';
	amount?: number;
	synced?: boolean;
};

const EVENTS_KEY = 'analytics_events_v1';

export async function recordEvent(event: Omit<AnalyticsEvent, 'id'|'timestamp'|'synced'> & Partial<Pick<AnalyticsEvent, 'timestamp'|'synced'>>) {
	const ev: AnalyticsEvent = {
		id: globalThis.crypto?.randomUUID?.() ?? String(Date.now()) + Math.random().toString(16).slice(2),
		timestamp: event.timestamp ?? Date.now(),
		synced: event.synced ?? false,
		type: event.type as AnalyticsEventType,
		productType: event.productType,
		salesChannel: event.salesChannel,
		amount: event.amount
	};
	const events = await getEvents();
	events.push(ev);
	await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
	return ev;
}

export async function getEvents(): Promise<AnalyticsEvent[]> {
	try {
		const raw = await AsyncStorage.getItem(EVENTS_KEY);
		return raw ? (JSON.parse(raw) as AnalyticsEvent[]) : [];
	} catch {
		return [];
	}
}

export type AnalyticsFilters = {
	startDate?: Date;
	endDate?: Date;
	productType?: string | 'all';
	salesChannel?: 'all'|'stripe'|'gumroad'|'other';
};

export type Summary = {
	totalProducts: number;
	totalExports: number;
	totalAiMessages: number;
	totalSalesCount: number;
	totalSalesAmount: number;
};

export async function getSummary(filters: AnalyticsFilters = {}): Promise<Summary> {
	const events = await getEvents();
	const startTs = filters.startDate?.getTime() ?? 0;
	const endTs = filters.endDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
	const productType = filters.productType && filters.productType !== 'all' ? filters.productType : undefined;
	const salesChannel = filters.salesChannel && filters.salesChannel !== 'all' ? filters.salesChannel : undefined;

	const inRange = events.filter(e => e.timestamp >= startTs && e.timestamp <= endTs);
	const byProductType = productType ? inRange.filter(e => e.productType === productType) : inRange;
	const byChannel = salesChannel ? byProductType.filter(e => e.salesChannel === salesChannel) : byProductType;

	const totalProducts = byChannel.filter(e => e.type === 'product_created').length;
	const totalExports = byChannel.filter(e => e.type === 'exported').length;
	const totalAiMessages = byChannel.filter(e => e.type === 'ai_user' || e.type === 'ai_assistant').length;
	const salesEvents = byChannel.filter(e => e.type === 'sale_stripe' || e.type === 'sale_gumroad');
	const totalSalesCount = salesEvents.length;
	const totalSalesAmount = salesEvents.reduce((sum, e) => sum + (e.amount ?? 0), 0);
	return { totalProducts, totalExports, totalAiMessages, totalSalesCount, totalSalesAmount };
}

export type TimePoint = { x: Date; y: number };

export async function getTimeSeries(type: AnalyticsEventType | 'ai_all' | 'sales_amount', filters: AnalyticsFilters = {}, bucket: 'day'|'week'|'month' = 'day'): Promise<TimePoint[]> {
	const events = await getEvents();
	const startTs = filters.startDate?.getTime() ?? 0;
	const endTs = filters.endDate?.getTime() ?? Date.now();
	const productType = filters.productType && filters.productType !== 'all' ? filters.productType : undefined;
	const salesChannel = filters.salesChannel && filters.salesChannel !== 'all' ? filters.salesChannel : undefined;

	const inRange = events.filter(e => e.timestamp >= startTs && e.timestamp <= endTs);
	const byProductType = productType ? inRange.filter(e => e.productType === productType) : inRange;
	const byChannel = salesChannel ? byProductType.filter(e => e.salesChannel === salesChannel) : byProductType;

	function bucketStart(d: Date) {
		const b = new Date(d);
		if (bucket === 'day') { b.setHours(0,0,0,0); }
		else if (bucket === 'week') { const day = b.getDay(); const diff = (day + 6) % 7; b.setDate(b.getDate() - diff); b.setHours(0,0,0,0); }
		else { b.setDate(1); b.setHours(0,0,0,0); }
		return b;
	}

	const map = new Map<number, number>();
	for (const e of byChannel) {
		const date = bucketStart(new Date(e.timestamp)).getTime();
		const key = date;
		let inc = 0;
		if (type === 'ai_all') inc = (e.type === 'ai_user' || e.type === 'ai_assistant') ? 1 : 0;
		else if (type === 'sales_amount') inc = (e.type === 'sale_stripe' || e.type === 'sale_gumroad') ? (e.amount ?? 0) : 0;
		else inc = e.type === type ? 1 : 0;
		if (!inc) continue;
		map.set(key, (map.get(key) ?? 0) + inc);
	}

	const points: TimePoint[] = Array.from(map.entries()).sort((a,b) => a[0]-b[0]).map(([k,v]) => ({ x: new Date(k), y: v }));
	return points;
}

export async function syncPendingEvents(baseUrl: string) {
	if (!baseUrl) return;
	const events = await getEvents();
	let changed = false;
	for (const e of events) {
		if (e.synced) continue;
		try {
			await fetch(`${baseUrl}/api/analytics`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ t: e.type }) });
			e.synced = true;
			changed = true;
		} catch {}
	}
	if (changed) await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}