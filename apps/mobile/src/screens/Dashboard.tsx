import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';
import * as Network from 'expo-network';
import { VictoryBar, VictoryChart, VictoryLine, VictoryPie, VictoryTheme } from 'victory-native';
import { getSummary, getTimeSeries, recordEvent, syncPendingEvents, type AnalyticsFilters } from '../lib/analytics';

export default function Dashboard() {
	const [fontLoaded, setFontLoaded] = useState(false);
	const [filters, setFilters] = useState<AnalyticsFilters>({ salesChannel: 'all', productType: 'all' });
	const [range, setRange] = useState<'7d'|'30d'|'90d'|'all'>('30d');
	const [summary, setSummary] = useState({ totalProducts: 0, totalExports: 0, totalAiMessages: 0, totalSalesCount: 0, totalSalesAmount: 0 });
	const [salesSeries, setSalesSeries] = useState<{ x: Date; y: number }[]>([]);
	const [aiSeries, setAiSeries] = useState<{ x: Date; y: number }[]>([]);

	useEffect(() => {
		Font.loadAsync({ Urbanist: require('../assets/Urbanist-VariableFont_wght.ttf') }).then(() => setFontLoaded(true));
	}, []);

	useEffect(() => {
		refresh();
		// Try to sync events when online
		Network.getNetworkStateAsync().then(state => {
			if (state.isConnected) syncPendingEvents(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000');
		});
	}, [filters, range]);

	function rangeToDates() {
		const end = new Date();
		let start: Date | undefined;
		if (range === '7d') { start = new Date(); start.setDate(start.getDate()-7); }
		else if (range === '30d') { start = new Date(); start.setDate(start.getDate()-30); }
		else if (range === '90d') { start = new Date(); start.setDate(start.getDate()-90); }
		else { start = undefined; }
		return { start, end };
	}

	async function refresh() {
		const { start, end } = rangeToDates();
		const f = { ...filters, startDate: start, endDate: end };
		const s = await getSummary(f);
		try {
			const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
			const remote = await import('../lib/remoteSales');
			const stripe = await remote.fetchStripeSalesSummary(base, start, end);
			if (stripe && stripe.ok) {
				s.totalSalesAmount = stripe.totalAmount;
				s.totalSalesCount = stripe.totalCount;
			}
		} catch {}
		setSummary({ ...s });
		const [sales, ai] = await Promise.all([
			getTimeSeries('sales_amount', f, 'day'),
			getTimeSeries('ai_all', f, 'day')
		]);
		setSalesSeries(sales);
		setAiSeries(ai);
	}

	const header = (
		<View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12, backgroundColor: 'transparent' }}>
			<Text style={{ fontFamily: fontLoaded ? 'Urbanist' : undefined, fontSize: 24 }}>Advanced Dashboard</Text>
			<View style={{ flexDirection: 'row', marginTop: 10, gap: 8 }}>
				<HeaderButton label="Create Product" onPress={async () => { await recordEvent({ type: 'product_created' }); await refresh(); }} />
				<HeaderButton label="Export" onPress={async () => { await recordEvent({ type: 'exported' }); await refresh(); }} />
				<HeaderButton label="Market Analysis" onPress={async () => { await recordEvent({ type: 'ai_user' }); await refresh(); }} />
			</View>
		</View>
	);

	return (
		<LinearGradient colors={["#F6E7FF","#E9F0FF","#D7F7FF"]} start={{x:0,y:0}} end={{x:1,y:1}} style={{ flex: 1 }}>
			<SafeAreaView style={{ flex: 1 }}>
				{header}
				<View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
					<Filters range={range} onChangeRange={setRange} filters={filters} onChangeFilters={setFilters} fontLoaded={fontLoaded} />
				</View>
				<ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
					<StatsGrid fontLoaded={fontLoaded} summary={summary} />
					<View style={{ backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 16, padding: 12, marginTop: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' }}>
						<Text style={{ fontFamily: fontLoaded ? 'Urbanist' : undefined, fontSize: 16, marginBottom: 8 }}>Sales Performance</Text>
						<VictoryChart theme={VictoryTheme.material}>
							<VictoryLine data={salesSeries.map(p => ({ x: p.x, y: p.y }))} style={{ data: { stroke: '#7C3AED' } }} />
						</VictoryChart>
					</View>
					<View style={{ backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 16, padding: 12, marginTop: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' }}>
						<Text style={{ fontFamily: fontLoaded ? 'Urbanist' : undefined, fontSize: 16, marginBottom: 8 }}>AI Usage</Text>
						<VictoryChart theme={VictoryTheme.material}>
							<VictoryBar data={aiSeries.map(p => ({ x: p.x, y: p.y }))} style={{ data: { fill: '#10B981' } }} />
						</VictoryChart>
					</View>
					<View style={{ backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 16, padding: 12, marginTop: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' }}>
						<Text style={{ fontFamily: fontLoaded ? 'Urbanist' : undefined, fontSize: 16, marginBottom: 8 }}>Sales by Channel</Text>
						<View style={{ alignItems: 'center' }}>
							<VictoryPie
								colorScale={["#6366F1", "#F59E0B", "#6EE7B7"]}
								data={useMemo(() => [
									{ x: 'Stripe', y: 0 },
									{ x: 'Gumroad', y: 0 },
									{ x: 'Other', y: 0 },
								], [])}
							/>
						</View>
					</View>
				</ScrollView>
			</SafeAreaView>
		</LinearGradient>
	);
}

function HeaderButton({ label, onPress }: { label: string; onPress: () => void }) {
	return (
		<TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ backgroundColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' }}>
			<Text style={{ fontSize: 14 }}>{label}</Text>
		</TouchableOpacity>
	);
}

function Filters({ range, onChangeRange, filters, onChangeFilters, fontLoaded }: { range: '7d'|'30d'|'90d'|'all'; onChangeRange: (r: '7d'|'30d'|'90d'|'all') => void; filters: AnalyticsFilters; onChangeFilters: (f: AnalyticsFilters) => void; fontLoaded: boolean; }) {
	return (
		<View style={{ gap: 10 }}>
			<Text style={{ fontFamily: fontLoaded ? 'Urbanist' : undefined, fontSize: 18 }}>Filters</Text>
			<View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
				{(['7d','30d','90d','all'] as const).map(opt => (
					<ToggleChip key={opt} selected={range===opt} label={opt.toUpperCase()} onPress={() => onChangeRange(opt)} />
				))}
			</View>
			<View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
				{(['all','digital','service','template','other'] as const).map(pt => (
					<ToggleChip key={pt} selected={filters.productType===pt} label={`Type: ${pt}`} onPress={() => onChangeFilters({ ...filters, productType: pt })} />
				))}
			</View>
			<View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
				{(['all','stripe','gumroad','other'] as const).map(sc => (
					<ToggleChip key={sc} selected={filters.salesChannel===sc} label={`Channel: ${sc}`} onPress={() => onChangeFilters({ ...filters, salesChannel: sc })} />
				))}
			</View>
		</View>
	);
}

function ToggleChip({ selected, label, onPress }: { selected: boolean; label: string; onPress: () => void }) {
	return (
		<TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ backgroundColor: selected ? '#fff' : 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 }}>
			<Text style={{ fontSize: 12 }}>{label}</Text>
		</TouchableOpacity>
	);
}

function StatsGrid({ summary, fontLoaded }: { summary: { totalProducts: number; totalExports: number; totalAiMessages: number; totalSalesCount: number; totalSalesAmount: number }; fontLoaded: boolean; }) {
	return (
		<View style={{ gap: 12 }}>
			<View style={{ flexDirection: 'row', gap: 12 }}>
				<StatCard title="Products" value={summary.totalProducts} fontLoaded={fontLoaded} />
				<StatCard title="Exports" value={summary.totalExports} fontLoaded={fontLoaded} />
			</View>
			<View style={{ flexDirection: 'row', gap: 12 }}>
				<StatCard title="AI Messages" value={summary.totalAiMessages} fontLoaded={fontLoaded} />
				<StatCard title="Sales" value={summary.totalSalesCount} secondary={`$${summary.totalSalesAmount.toFixed(2)}`} fontLoaded={fontLoaded} />
			</View>
		</View>
	);
}

function StatCard({ title, value, secondary, fontLoaded }: { title: string; value: number | string; secondary?: string; fontLoaded: boolean; }) {
	return (
		<View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.6)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', borderRadius: 16, padding: 12 }}>
			<Text style={{ fontFamily: fontLoaded ? 'Urbanist' : undefined, fontSize: 14, opacity: 0.8 }}>{title}</Text>
			<Text style={{ fontFamily: fontLoaded ? 'Urbanist' : undefined, fontSize: 24 }}>{String(value)}</Text>
			{secondary ? <Text style={{ fontFamily: fontLoaded ? 'Urbanist' : undefined, fontSize: 12, opacity: 0.8 }}>{secondary}</Text> : null}
		</View>
	);
}