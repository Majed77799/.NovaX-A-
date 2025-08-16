import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import Card from '../components/Card';

const Stat = ({ label, value }: { label: string; value: string }) => (
	<View className="flex-1">
		<Text className="text-ink/60 mb-1">{label}</Text>
		<Text className="text-2xl font-urbanistMedium">{value}</Text>
	</View>
);

const Bar = ({ h }: { h: number }) => (
	<View className="w-3 rounded-t-md bg-white/70 border border-white/25" style={{ height: h }} />
);

export default function DashboardScreen() {
	return (
		<GradientBackground>
			<SafeAreaView style={{ flex: 1 }}>
				<View className="p-4 gap-4">
					<Text className="text-2xl font-urbanistBold mb-2">Dashboard</Text>
					<View className="flex-row gap-3">
						<Card className="flex-1 p-4">
							<Stat label="Products" value="24" />
						</Card>
						<Card className="flex-1 p-4">
							<Stat label="Freebies" value="8" />
						</Card>
					</View>
					<View className="flex-row gap-3">
						<Card className="flex-1 p-4">
							<Stat label="Sales" value="$3.2k" />
						</Card>
						<Card className="flex-1 p-4">
							<Stat label="Conversion" value="4.8%" />
						</Card>
					</View>

					<Card className="p-4 mt-2">
						<Text className="mb-3 text-ink/70">Weekly Sales</Text>
						<View className="flex-row items-end gap-2 h-36">
							{[24, 36, 28, 44, 52, 30, 62].map((v, i) => (
								<View key={i} className="items-center">
									<Bar h={v*2} />
								</View>
							))}
						</View>
					</Card>
				</View>
			</SafeAreaView>
		</GradientBackground>
	);
}