import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { useTheme, ThemeMode } from '../theme';
import { Text } from '../components/atoms/Text';
import { Button } from '../components/atoms/Button';
import { setLocale, SupportedLocale, t } from '../localization';

export function SettingsScreen() {
	const { tokens, mode, setMode } = useTheme();

	function nextMode(current: ThemeMode): ThemeMode {
		return current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={{ padding: tokens.spacing.lg, gap: tokens.spacing.md }}>
				<Text variant="title" medium>{t('screen.settings')}</Text>
				<View style={{ gap: 8 }}>
					<Text>{t('settings.theme')}: {mode}</Text>
					<Button title="Toggle" onPress={() => setMode(nextMode(mode))} />
				</View>
				<View style={{ gap: 8 }}>
					<Text>{t('settings.language')}</Text>
					<View style={{ flexDirection: 'row', gap: tokens.spacing.sm }}>
						<Button title="EN" onPress={() => setLocale('en')} variant="secondary" />
						<Button title="ES" onPress={() => setLocale('es')} variant="secondary" />
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
}