import React from 'react';
import { Image, SafeAreaView, ScrollView, Text, View } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import Card from '../components/Card';

const badges = ['🔥 Streak 30d', '🛠 Creator', '⭐ Top Seller'];
const products = Array.from({ length: 6 }).map((_, i) => ({ id: `${i}`, title: `Nova Asset ${i+1}`, image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop' }));

export default function ProfileScreen() {
	return (
		<GradientBackground>
			<SafeAreaView style={{ flex: 1 }}>
				<ScrollView contentContainerStyle={{ padding: 16 }}>
					<Text className="text-2xl font-urbanistBold mb-3">Profile</Text>
					<Card className="p-4 items-center">
						<Image source={{ uri: 'https://i.pravatar.cc/200' }} style={{ width: 96, height: 96, borderRadius: 48 }} />
						<Text className="mt-3 text-xl font-urbanistMedium">NovaX Maker</Text>
						<Text className="text-ink/60">Level 12 • 1,240 XP</Text>
						<View className="flex-row gap-2 mt-3 flex-wrap justify-center">
							{badges.map((b, i) => (
								<View key={i} className="bg-white/70 border border-white/25 rounded-full px-3 py-1">
									<Text className="text-xs">{b}</Text>
								</View>
							))}
						</View>
					</Card>

					<Text className="mt-4 mb-2 text-lg font-urbanistMedium">Your Products</Text>
					<View className="gap-2">
						{products.map(p => (
							<Card key={p.id} className="p-2 flex-row items-center gap-3">
								<Image source={{ uri: p.image }} style={{ width: 64, height: 64, borderRadius: 12 }} />
								<Text className="text-base font-urbanist">{p.title}</Text>
							</Card>
						))}
					</View>
				</ScrollView>
			</SafeAreaView>
		</GradientBackground>
	);
}