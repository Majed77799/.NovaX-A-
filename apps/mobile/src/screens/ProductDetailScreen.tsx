import React from 'react';
import { Image, SafeAreaView, ScrollView, View } from 'react-native';
import { useTheme } from '../theme';
import { Text } from '../components/atoms/Text';
import { Button } from '../components/atoms/Button';

export function ProductDetailScreen() {
	const { tokens } = useTheme();
	// In a real app, get product by route params
	const product = { title: 'Neon UI Kit', price: 29, image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1400&auto=format&fit=crop', description: 'Figma UI Kit with 120+ components and 4 color themes.' };
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ScrollView contentContainerStyle={{ paddingBottom: tokens.spacing.xxl }}>
				<Image source={{ uri: product.image }} style={{ width: '100%', height: 260 }} />
				<View style={{ padding: tokens.spacing.lg, gap: tokens.spacing.md }}>
					<Text variant="title" medium>{product.title}</Text>
					<Text color="secondary">{product.description}</Text>
					<Button variant="gradient" title={`Buy • $${product.price}`} onPress={() => {}} />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}