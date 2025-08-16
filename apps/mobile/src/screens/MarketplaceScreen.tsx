import React from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import Card from '../components/Card';

const products = Array.from({ length: 12 }).map((_, i) => ({
	id: `${i}`,
	title: `Nova Pack ${i+1}`,
	price: i % 3 === 0 ? 0 : 19,
	likes: 120 + i * 3,
	shares: 24 + i,
	image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=800&auto=format&fit=crop'
}));

export default function MarketplaceScreen() {
	return (
		<GradientBackground>
			<SafeAreaView style={{ flex: 1 }}>
				<ScrollView contentContainerStyle={{ padding: 16 }}>
					<Text className="text-2xl font-urbanistBold mb-3">Marketplace</Text>
					<View className="flex-row flex-wrap -mx-1">
						{products.map(p => (
							<View key={p.id} className="w-1/2 px-1 mb-2">
								<Card className="p-2">
									<Image source={{ uri: p.image }} resizeMode="cover" style={{ height: 140, borderRadius: 12 }} />
									<Text className="mt-2 text-base font-urbanist">{p.title}</Text>
									<View className="flex-row justify-between items-center mt-1">
										<Text className="text-ink/70">{p.price === 0 ? 'Free' : `$${p.price}`}</Text>
										<View className="flex-row gap-3">
											<Text>❤ {p.likes}</Text>
											<Text>↗ {p.shares}</Text>
										</View>
									</View>
									<TouchableOpacity className="mt-2 bg-white rounded-xl py-2 items-center btn">
										<Text>{p.price === 0 ? 'Get Freebie' : 'Buy'}</Text>
									</TouchableOpacity>
								</Card>
							</View>
						))}
					</View>
				</ScrollView>
			</SafeAreaView>
		</GradientBackground>
	);
}