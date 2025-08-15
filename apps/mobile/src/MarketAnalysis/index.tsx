import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import Constants from 'expo-constants';

export default function MarketAnalysisScreen() {
	const [keywords, setKeywords] = useState('Notion template, Canva template, printable planner');
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<any | null>(null);
	const baseUrl = (Constants?.expoConfig?.extra as any)?.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

	useEffect(() => {
		AsyncStorage.getItem('market:last').then(v => { if (v) setData(JSON.parse(v)); });
	}, []);

	async function run() {
		const list = keywords.split(',').map(s => s.trim()).filter(Boolean);
		if (!list.length) return;
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		setLoading(true);
		try {
			const res = await fetch(`${baseUrl}/api/market`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ keywords: list, geo: 'US' }) });
			if (!res.ok) throw new Error('market analysis failed');
			const json = await res.json();
			setData(json);
			await AsyncStorage.setItem('market:last', JSON.stringify(json));
		} catch (err: any) {
			Alert.alert('Analysis failed', err?.message ?? String(err));
		} finally {
			setLoading(false);
		}
	}

	async function exportPDF() {
		if (!data) return;
		const html = renderHTML(data);
		const { uri } = await Print.printToFileAsync({ html });
		await shareAsync(uri, { mimeType: 'application/pdf' });
	}

	return (
		<SafeAreaView style={{ flex: 1, padding: 16 }}>
			<Text style={{ fontSize: 22, fontWeight: '600', marginBottom: 8 }}>Market Analysis</Text>
			<TextInput
				value={keywords}
				onChangeText={setKeywords}
				placeholder="Keywords (comma separated)"
				style={{ borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', borderRadius: 8, padding: 12, marginBottom: 12 }}
			/>
			<View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
				<TouchableOpacity onPress={run} disabled={loading} style={{ backgroundColor: '#111827', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 }}>
					<Text style={{ color: 'white' }}>{loading ? 'Analyzing…' : 'Run Analysis'}</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={exportPDF} disabled={!data} style={{ backgroundColor: '#4B5563', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 }}>
					<Text style={{ color: 'white' }}>Export PDF</Text>
				</TouchableOpacity>
			</View>
			{loading && <ActivityIndicator />}
			{data && (
				<View style={{ gap: 12, flex: 1 }}>
					<Text style={{ fontSize: 16 }}>Market Opportunity: <Text style={{ fontWeight: '700' }}>{data.marketOpportunityScore}/100</Text></Text>
					<Text style={{ fontSize: 16, marginBottom: 6 }}>Top Categories</Text>
					<FlatList
						data={data.topCategories}
						keyExtractor={(item: any) => item.category}
						renderItem={({ item }: any) => (
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.05)' }}>
								<Text>{capitalize(item.category)}</Text>
								<Text>{item.demandScore}</Text>
							</View>
						)}
					/>
					<Text style={{ fontSize: 16, marginTop: 6 }}>Suggested Price Ranges</Text>
					<FlatList
						data={Object.entries(data.suggestedPriceRanges)}
						keyExtractor={(item: any) => item[0]}
						renderItem={({ item }: any) => (
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.05)' }}>
								<Text>{capitalize(item[0])}</Text>
								<Text>${item[1].low} - ${item[1].high}</Text>
							</View>
						)}
					/>
					<Text style={{ fontSize: 16, marginTop: 6 }}>AI Recommendations</Text>
					{data.recommendations?.map((r: string, i: number) => (
						<Text key={i} style={{ paddingVertical: 2 }}>{r}</Text>
					))}
				</View>
			)}
		</SafeAreaView>
	);
}

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

function renderHTML(data: any) {
	return `<!doctype html>
	<html><head><meta charset="utf-8" /><style>
	body{font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial; padding: 24px;}
	h1{font-size:22px;margin:0 0 8px}
	h2{font-size:16px;margin:16px 0 8px}
	.table{width:100%;border-collapse:collapse}
	.table td,.table th{border:1px solid #eee;padding:8px;text-align:left}
	.badge{background:#111827;color:#fff;padding:4px 8px;border-radius:6px}
	</style></head>
	<body>
		<h1>Market Analysis</h1>
		<div>Market Opportunity: <span class="badge">${data.marketOpportunityScore}/100</span></div>
		<h2>Top Categories</h2>
		<table class="table">
			<tbody>
				${data.topCategories.map((c: any) => `<tr><td>${capitalize(c.category)}</td><td>${c.demandScore}</td></tr>`).join('')}
			</tbody>
		</table>
		<h2>Suggested Price Ranges</h2>
		<table class="table">
			<tbody>
				${Object.entries<any>(data.suggestedPriceRanges).map(([k,v]) => `<tr><td>${capitalize(k)}</td><td>$${v.low} - $${v.high}</td></tr>`).join('')}
			</tbody>
		</table>
		<h2>AI Recommendations</h2>
		<ul>
			${(data.recommendations||[]).map((r: string) => `<li>${r}</li>`).join('')}
		</ul>
	</body></html>`;
}