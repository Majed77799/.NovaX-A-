import React from 'react';
import { ImageBackground, Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';
import { Text } from '../atoms/Text';
import { Badge } from '../atoms/Badge';

export type CardProps = {
	title: string;
	subtitle?: string;
	badgeLabel?: string;
	onPress?: () => void;
	imageUri?: string;
	footer?: React.ReactNode;
};

export function Card({ title, subtitle, badgeLabel, imageUri, onPress, footer }: CardProps) {
	const { tokens } = useTheme();
	const content = (
		<View style={{ padding: tokens.spacing.md, gap: 8 }}>
			<Text variant="subtitle" medium>
				{title}
			</Text>
			{subtitle ? <Text color="secondary">{subtitle}</Text> : null}
			{footer}
		</View>
	);
	return (
		<Pressable onPress={onPress} style={{ overflow: 'hidden', borderRadius: tokens.radii.lg, backgroundColor: tokens.colors.card, borderWidth: 1, borderColor: tokens.colors.border }}>
			{imageUri ? (
				<ImageBackground source={{ uri: imageUri }} style={{ height: 140 }}>
					{badgeLabel ? (
						<View style={{ position: 'absolute', top: 10, left: 10 }}>
							<Badge label={badgeLabel} tone="brand" />
						</View>
					) : null}
				</ImageBackground>
			) : (
				<LinearGradient colors={tokens.gradients.card} style={{ height: 140 }} />
			)}
			{content}
		</Pressable>
	);
}