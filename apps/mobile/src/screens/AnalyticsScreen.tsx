import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { KpiCard, FilterBar, Sparkline } from '@acme/ui';
import { useAnalyticsData } from '@acme/core';

export default function AnalyticsScreen() {
	const { data, isLoading, isOfflineSnapshot, snapshotTimestamp } = useAnalyticsData({
		metric: 'overview',
		range: '30d'
	});

	const kpis = useMemo(() => data?.kpis ?? [], [data]);

	return (
		<ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
			<FilterBar />
			{isOfflineSnapshot && (
				<View style={{ marginTop: 8, marginBottom: 8 }}>
					<BlurView intensity={40} tint="dark" style={{ borderRadius: 12, overflow: 'hidden' }}>
						<View style={{ padding: 8, alignSelf: 'flex-start' }}>
							<Text style={{ color: '#94A3B8', fontSize: 12 }}>Offline snapshot ({snapshotTimestamp})</Text>
						</View>
					</BlurView>
				</View>
			)}

			<View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
				{kpis.slice(0, 3).map((k) => (
					<KpiCard key={k.id} label={k.label} value={k.value} delta={k.delta}>
						<Sparkline data={k.sparkline} />
					</KpiCard>
				))}
			</View>

			<LinearGradient
				colors={["rgba(94,234,212,0.12)", "transparent"]}
				style={{ height: 1, marginVertical: 16 }}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
			/>

			<View style={{ gap: 16 }}>
				{/* Lazy charts rendered within UI components */}
				<KpiCard label="Time Series" value="" delta={0}>
					{/* Heavy chart is lazy-loaded internally */}
					<Sparkline data={data?.series?.slice(-30) ?? []} />
				</KpiCard>
			</View>
		</ScrollView>
	);
}