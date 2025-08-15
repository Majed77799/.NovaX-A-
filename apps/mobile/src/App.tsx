import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as Font from 'expo-font';
import MarketAnalysisScreen from './MarketAnalysis';

const ORB_SIZE = 96;

type Message = { id: string; role: 'user'|'assistant'|'system'; content: string };

type OrbState = 'idle'|'thinking'|'speaking';

type Mode = 'assistant' | 'market';

export default function App() {
	const [fontLoaded, setFontLoaded] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');
	const [orb, setOrb] = useState<OrbState>('idle');
	const [mode, setMode] = useState<Mode>('assistant');
	const scrollRef = useRef<ScrollView>(null);

	useEffect(() => {
		Font.loadAsync({ Urbanist: require('./assets/Urbanist-VariableFont_wght.ttf') }).then(() => setFontLoaded(true));
	}, []);

	useEffect(() => { scrollRef.current?.scrollToEnd({ animated: true }); }, [messages.length]);

	async function send(text: string) {
		if (!text.trim()) return;
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text.trim() };
		setMessages(prev => [...prev, userMsg]);
		setInput('');
		setOrb('thinking');
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [...messages, userMsg] }) });
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

	if (mode === 'market') {
		return <MarketAnalysisScreen />;
	}

	return (
		<LinearGradient colors={["#F6E7FF","#E9F0FF","#D7F7FF"]} start={{x:0,y:0}} end={{x:1,y:1}} style={{ flex: 1 }}>
			<SafeAreaView style={{ flex: 1 }}>
				<View style={{ height: ORB_SIZE, width: ORB_SIZE, borderRadius: ORB_SIZE/2, margin: 12, shadowColor: '#7841FF', shadowOpacity: 0.35, shadowRadius: 16, backgroundColor: 'rgba(255,255,255,0.35)', overflow: 'hidden' }} />
				<ScrollView ref={scrollRef} contentContainerStyle={{ padding: 16, paddingBottom: 140 }}>
					{messages.map(m => (
						<View key={m.id} style={{ maxWidth: '80%', alignSelf: m.role === 'assistant' ? 'flex-start' : 'flex-end', backgroundColor: m.role === 'assistant' ? 'rgba(255,255,255,0.5)' : '#fff', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, marginBottom: 10, borderWidth: m.role==='assistant'?1:0, borderColor: 'rgba(255,255,255,0.25)' }}>
							<Text style={{ fontFamily: fontLoaded ? 'Urbanist' : undefined, fontSize: 16, lineHeight: 22 }}>{m.content}</Text>
						</View>
					))}
				</ScrollView>
				<View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16 }}>
					<View style={{ backgroundColor: '#fff', borderRadius: 999, borderWidth: 1, borderColor: 'rgba(15,18,35,0.08)', padding: 10, flexDirection: 'row', alignItems: 'flex-end', gap: 8, shadowColor: '#101828', shadowOpacity: 0.06, shadowRadius: 20 }}>
						<View style={{ flexDirection: 'row', gap: 6 }}>
							<QuickChip label="Summarize" onPress={() => send('Summarize my day in 3 bullet points.')} />
							<QuickChip label="Translate" onPress={() => send('Translate the last message to Spanish.')} />
							<QuickChip label="To‑do" onPress={() => send('Create a to-do list for this week.')} />
							<QuickChip label="Market" onPress={() => setMode('market')} />
						</View>
						<TextInput
							style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 8, maxHeight: 24*4, fontFamily: fontLoaded ? 'Urbanist' : undefined }}
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