import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';
import { Text } from '../components/atoms/Text';
import { Button } from '../components/atoms/Button';
import { AssistantOrb } from '../components/organisms/AssistantOrb';
import { t } from '../localization';

export function OnboardingScreen({ onGetStarted }: { onGetStarted: () => void }) {
	const { tokens } = useTheme();
	return (
		<LinearGradient colors={tokens.gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
			<SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: tokens.spacing.lg }}>
				<View style={{ alignItems: 'center', gap: tokens.spacing.lg }}>
					<AssistantOrb size={120} />
					<Text variant="display" bold color="inverse" style={{ textAlign: 'center' }}>
						{t('onboarding.title')}
					</Text>
					<Text color="inverse" style={{ textAlign: 'center' }}>
						{t('onboarding.subtitle')}
					</Text>
					<Button variant="gradient" title={t('cta.getStarted')} onPress={onGetStarted} />
				</View>
			</SafeAreaView>
		</LinearGradient>
	);
}