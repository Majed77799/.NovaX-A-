import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as Font from 'expo-font';
import { pdfFromText } from './utils';

const pastelBg = ["#F6E7FF","#E9F0FF","#D7F7FF"];

type Mode = 'product_description'|'social_instagram'|'social_tiktok'|'social_twitter'|'ad_facebook'|'ad_google'|'email_template';

const modeLabels: Record<Mode, string> = {
	product_description: 'Product',
	social_instagram: 'Instagram',
	social_tiktok: 'TikTok',
	social_twitter: 'Twitter',
	ad_facebook: 'FB Ads',
	ad_google: 'Google Ads',
	email_template: 'Email'
};

export default function ContentGenerator() {
	const [fontLoaded, setFontLoaded] = useState(false);
	const [mode, setMode] = useState<Mode>('product_description');
	const [keywords, setKeywords] = useState('');
	const [targetAudience, setTargetAudience] = useState('');
	const [useTrends, setUseTrends] = useState(true);
	const [category, setCategory] = useState('general');
	const [output, setOutput] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		Font.loadAsync({ Urbanist: require('../../assets/Urbanist-VariableFont_wght.ttf') }).then(() => setFontLoaded(true));
	}, []);

	async function generate() {
		if (!keywords.trim()) { Alert.alert('Please enter keywords or product name'); return; }
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		setOutput('');
		setIsLoading(true);
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/generate`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ mode, keywords, product: keywords, targetAudience, useTrends, category })
			});
			if (!res.body) { setIsLoading(false); return; }
			const reader = res.body.getReader();
			const decoder = new TextDecoder();
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				const chunk = decoder.decode(value, { stream: true });
				setOutput(prev => prev + chunk);
			}
		} catch (e) {
			Alert.alert('Generation failed', String(e))
		} finally {
			setIsLoading(false);
		}
	}

	async function optimize() {
		if (!output.trim()) return;
		setIsLoading(true);
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/generate`, {
				method: 'POST', headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ mode, keywords: `${output}\n\nRefine for target audience: ${targetAudience || 'general consumers'}. Keep voice consistent, improve clarity, and tighten.` })
			});
			if (!res.body) { setIsLoading(false); return; }
			const reader = res.body.getReader();
			const decoder = new TextDecoder();
			let refined = '';
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				const chunk = decoder.decode(value, { stream: true });
				refined += chunk;
			}
			setOutput(refined);
		} finally {
			setIsLoading(false);
		}
	}

	async function saveLocally() {
		if (!output.trim()) return;
		const dir = FileSystem.documentDirectory!;
		const path = dir + `content_${Date.now()}.txt`;
		await FileSystem.writeAsStringAsync(path, output);
		Alert.alert('Saved', `Saved to ${path}`);
	}

	async function exportTxt() {
		if (!output.trim()) return;
		const dir = FileSystem.cacheDirectory!;
		const path = dir + `content_${Date.now()}.txt`;
		await FileSystem.writeAsStringAsync(path, output);
		if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(path);
	}

	async function exportPdf() {
		if (!output.trim()) return;
		// Minimal PDF generation using a simple wrapper (text only).
			const pdfContent = pdfFromText(output);
		const dir = FileSystem.cacheDirectory!;
		const path = dir + `content_${Date.now()}.pdf`;
		await FileSystem.writeAsStringAsync(path, pdfContent, { encoding: FileSystem.EncodingType.Base64 });
		if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(path);
	}

	async function copyToClipboard() {
		if (!output.trim()) return;
		await Clipboard.setStringAsync(output);
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
	}

	return (
		<LinearGradient colors={pastelBg} start={{x:0,y:0}} end={{x:1,y:1}} style={{ flex: 1 }}>
			<SafeAreaView style={{ flex: 1 }}>
				<View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
					<Text style={{ fontFamily: fontLoaded ? 'Urbanist' : undefined, fontSize: 24 }}>AI Content Generator</Text>
				</View>
				<ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 160 }}>
					<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
						{(Object.keys(modeLabels) as Mode[]).map(m => (
							<Tab key={m} label={modeLabels[m]} selected={mode===m} onPress={() => setMode(m)} />
						))}
					</View>

					<View style={{ marginTop: 12, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(15,18,35,0.08)' }}>
						<TextInput
							style={{ paddingHorizontal: 14, paddingVertical: 12, minHeight: 48, fontFamily: fontLoaded ? 'Urbanist' : undefined }}
							placeholder="Enter keywords or product name"
							value={keywords}
							onChangeText={setKeywords}
						/>
						<View style={{ flexDirection: 'row', gap: 8, padding: 12 }}>
							<MiniInput value={targetAudience} onChangeText={setTargetAudience} placeholder="Target audience (optional)" />
							<MiniInput value={category} onChangeText={setCategory} placeholder="Category (general, fashion, tech)" />
							<Toggle label="Use trends" value={useTrends} onChange={setUseTrends} />
						</View>
					</View>

					<View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
						<PrimaryButton label={isLoading ? 'Generating…' : 'Generate'} onPress={generate} disabled={isLoading} />
						<SecondaryButton label="One‑click optimize" onPress={optimize} disabled={isLoading || !output} />
					</View>

					<View style={{ marginTop: 16, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' }}>
						<Text style={{ padding: 12, opacity: 0.6 }}>Output</Text>
						<Text style={{ paddingHorizontal: 12, paddingBottom: 12, fontFamily: fontLoaded ? 'Urbanist' : undefined, fontSize: 16, lineHeight: 22 }}>{output || '—'}</Text>
					</View>

					<View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
						<SecondaryButton label="Save locally" onPress={saveLocally} disabled={!output} />
						<SecondaryButton label="Export .txt" onPress={exportTxt} disabled={!output} />
						<SecondaryButton label="Export PDF" onPress={exportPdf} disabled={!output} />
						<SecondaryButton label="Copy" onPress={copyToClipboard} disabled={!output} />
					</View>
				</ScrollView>
			</SafeAreaView>
		</LinearGradient>
	);
}

function Tab({ label, selected, onPress }: { label: string; selected?: boolean; onPress: () => void }) {
	return (
		<TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: selected ? '#7841FF' : 'rgba(255,255,255,0.6)', backgroundColor: selected ? 'rgba(120,65,255,0.1)' : 'rgba(255,255,255,0.6)' }}>
			<Text>{label}</Text>
		</TouchableOpacity>
	);
}

function PrimaryButton({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
	return (
		<TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.8} style={{ backgroundColor: disabled ? '#A3A3A3' : '#7841FF', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12 }}>
			<Text style={{ color: '#fff' }}>{label}</Text>
		</TouchableOpacity>
	);
}

function SecondaryButton({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
	return (
		<TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.8} style={{ backgroundColor: 'rgba(255,255,255,0.7)', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' }}>
			<Text>{label}</Text>
		</TouchableOpacity>
	);
}

function MiniInput({ value, onChangeText, placeholder }: { value: string; onChangeText: (t: string) => void; placeholder?: string }) {
	return (
		<View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 999, borderWidth: 1, borderColor: 'rgba(15,18,35,0.08)' }}>
			<TextInput style={{ paddingHorizontal: 12, paddingVertical: 8 }} value={value} onChangeText={onChangeText} placeholder={placeholder} />
		</View>
	);
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
	return (
		<TouchableOpacity onPress={() => onChange(!value)} activeOpacity={0.8} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: value ? '#7841FF' : 'rgba(15,18,35,0.08)', backgroundColor: value ? 'rgba(120,65,255,0.12)' : 'rgba(255,255,255,0.7)' }}>
			<Text>{label}: {value ? 'On' : 'Off'}</Text>
		</TouchableOpacity>
	);
}