import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useFonts, Urbanist_400Regular } from '@expo-google-fonts/urbanist';

const ORB_SIZE = 96;

type Message = { id: string; role: 'user'|'assistant'|'system'; content: string };

type OrbState = 'idle'|'thinking'|'speaking';

type Summary = { range: { start: string; end: string }; totalEvents: number; activeProducts: number; byType: { type: string; total: number }[]; timeseries: { date: string; value: number }[]; previousTotal?: number; changePct?: number };

type Screen = 'chat' | 'analytics';

export default function App() {
	const [fontsLoaded] = useFonts({ Urbanist_400Regular });
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');
	const [orb, setOrb] = useState<OrbState>('idle');
	const scrollRef = useRef<ScrollView>(null);
	const [screen, setScreen] = useState<Screen>('chat');
	const [summary, setSummary] = useState<Summary | null>(null);

	useEffect(() => { scrollRef.current?.scrollToEnd({ animated: true }); }, [messages.length]);

	useEffect(() => { if (screen === 'analytics') { (async () => {
		try {
			const base = (process.env.EXPO_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000');
			const res = await fetch(`${base}/api/analytics?days=14`);
			if (res.ok) setSummary(await res.json());
		} catch {}
	})() } }, [screen]);

	async function send(text: string) {
		if (!text.trim()) return;
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text.trim() };
		setMessages(prev => [...prev, userMsg]);
		setInput('');
		setOrb('thinking');
		try {
			// non-blocking analytics event
			try { const base = (process.env.EXPO_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'); fetch(`${base}/api/analytics`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ t: 'message', product: 'chat' }) }); } catch {}
			const chatBase = (process.env.EXPO_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000');
			const res = await fetch(`${chatBase}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [...messages, userMsg] }) });
			if (!res.body) { setOrb('idle'); return; }
			const reader = res.body.getReader();
			const decoder = new TextDecoder();
			let assistantMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content: '' };
			setMessages(prev => [...prev, assistantMsg]);
			setOrb('speaking');
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				const chunk = decoder.decode(value, { stream: true });
				assistantMsg = { ...assistantMsg, content: assistantMsg.content + chunk };
				setMessages(prev => prev.map(m => m.id === assistantMsg.id ? assistantMsg : m));
			}
		} finally {
			setOrb('idle');
		}
	}

	const fontFamily = fontsLoaded ? 'Urbanist_400Regular' : undefined;

	return (
		<LinearGradient colors={["#F6E7FF","#E9F0FF","#D7F7FF"]} start={{x:0,y:0}} end={{x:1,y:1}} style={{ flex: 1 }}>
			<SafeAreaView style={{ flex: 1 }}>
				<View style={{ height: ORB_SIZE, width: ORB_SIZE, borderRadius: ORB_SIZE/2, margin: 12, shadowColor: '#7841FF', shadowOpacity: 0.35, shadowRadius: 16, backgroundColor: 'rgba(255,255,255,0.35)', overflow: 'hidden' }} />
				<View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16 }}>
					<TabButton label="Chat" active={screen==='chat'} onPress={() => setScreen('chat')} />
					<TabButton label="Analytics" active={screen==='analytics'} onPress={() => setScreen('analytics')} />
				</View>
				{screen === 'chat' ? (
					<>
						<ScrollView ref={scrollRef} contentContainerStyle={{ padding: 16, paddingBottom: 140 }}>
							{messages.map(m => (
								<View key={m.id} style={{ maxWidth: '80%', alignSelf: m.role === 'assistant' ? 'flex-start' : 'flex-end', backgroundColor: m.role === 'assistant' ? 'rgba(255,255,255,0.5)' : '#fff', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, marginBottom: 10, borderWidth: m.role==='assistant'?1:0, borderColor: 'rgba(255,255,255,0.25)' }}>
									<Text style={{ fontFamily, fontSize: 16, lineHeight: 22 }}>{m.content}</Text>
								</View>
							))}
						</ScrollView>
						<View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16 }}>
							<View style={{ backgroundColor: '#fff', borderRadius: 999, borderWidth: 1, borderColor: 'rgba(15,18,35,0.08)', padding: 10, flexDirection: 'row', alignItems: 'flex-end', gap: 8, shadowColor: '#101828', shadowOpacity: 0.06, shadowRadius: 20 }}>
								<View style={{ flexDirection: 'row', gap: 6 }}>
									<QuickChip label="Summarize" onPress={() => send('Summarize my day in 3 bullet points.')} />
									<QuickChip label="Translate" onPress={() => send('Translate the last message to Spanish.')} />
									<QuickChip label="To‑do" onPress={() => send('Create a to-do list for this week.')} />
								</View>
								<TextInput
									style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 8, maxHeight: 24*4, fontFamily }}
									value={input}
									multiline
									onChangeText={setInput}
									onSubmitEditing={() => send(input)}
									placeholder="Message Ello"
								/>
								<TouchableOpacity onPress={() => send(input)} activeOpacity={0.8} style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
									<Text>➤</Text>
								</TouchableOpacity>
							</View>
						</View>
					</>
				) : (
					<ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
						<View style={{ backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' }}>
							<Text style={{ fontFamily, fontSize: 20, fontWeight: '700', marginBottom: 6 }}>Market Analytics</Text>
							{!summary && <Text>Loading…</Text>}
							{summary && (
								<View style={{ gap: 8 }}>
									<Text>Total events: {formatNumber(summary.totalEvents)}</Text>
									<Text>Range: {new Date(summary.range.start).toLocaleDateString()} – {new Date(summary.range.end).toLocaleDateString()}</Text>
									<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
										{summary.byType.map(b => (
											<View key={b.type} style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' }}>
												<Text>{b.type}: {formatNumber(b.total)}</Text>
											</View>
										))}
									</View>
								</View>
							)}
						</View>
					</ScrollView>
				)}
			</SafeAreaView>
		</LinearGradient>
	);
}

function QuickChip({ label, onPress }: { label: string; onPress: () => void }) {
	return (
		<TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 }}>
			<Text style={{ fontSize: 12 }}>{label}</Text>
		</TouchableOpacity>
	);
}

function TabButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
	return (
		<TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: active ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)', borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>
			<Text style={{ fontWeight: active ? '700' : '500' }}>{label}</Text>
		</TouchableOpacity>
	);
}

function formatNumber(n: number) { try { return new Intl.NumberFormat().format(n); } catch { return String(n); } }