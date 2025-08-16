import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { NovaXProvider, Background, Text, Button, Card, Input } from '@novax/design-system';

const ORB_SIZE = 96;

type Message = { id: string; role: 'user'|'assistant'|'system'; content: string };

type OrbState = 'idle'|'thinking'|'speaking';

function ChatApp() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');
	const [orb, setOrb] = useState<OrbState>('idle');
	const scrollRef = useRef<ScrollView>(null);

	useEffect(() => { scrollRef.current?.scrollToEnd({ animated: true }); }, [messages.length]);

	async function send(text: string) {
		if (!text.trim()) return;
		try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
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

	return (
		<Background>
			<SafeAreaView style={{ flex: 1 }}>
				<View style={{ height: ORB_SIZE, width: ORB_SIZE, borderRadius: ORB_SIZE/2, margin: 12, backgroundColor: 'rgba(255,255,255,0.35)' }} />
				<ScrollView ref={scrollRef} contentContainerStyle={{ padding: 16, paddingBottom: 140 }}>
					{messages.map(m => (
						<View key={m.id} style={{ maxWidth: '80%', alignSelf: m.role === 'assistant' ? 'flex-start' : 'flex-end', marginBottom: 10 }}>
							<Card elevated={m.role==='assistant'} padding={10}>
								<Text size="md">{m.content}</Text>
							</Card>
						</View>
					))}
				</ScrollView>
				<View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16 }}>
					<View style={{ backgroundColor: '#fff', borderRadius: 999, borderWidth: 1, borderColor: 'rgba(15,18,35,0.08)', padding: 10, flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
						<View style={{ flexDirection: 'row', gap: 6 }}>
							<QuickChip label="Summarize" onPress={() => send('Summarize my day in 3 bullet points.')} />
							<QuickChip label="Translate" onPress={() => send('Translate the last message to Spanish.')} />
							<QuickChip label="To‑do" onPress={() => send('Create a to-do list for this week.')} />
						</View>
						<Input value={input} onChangeText={setInput} placeholder="Message Ello" multiline size="md" style={{ flex: 1 }} onSubmitEditing={() => send(input)} />
						<Button onPress={() => send(input)} size="md">➤</Button>
					</View>
				</View>
			</SafeAreaView>
		</Background>
	);
}

function QuickChip({ label, onPress }: { label: string; onPress: () => void }) {
	return (
		<Button size="sm" variant="secondary" onPress={onPress}>{label}</Button>
	);
}

export default function App() {
	return (
		<NovaXProvider>
			<ChatApp />
		</NovaXProvider>
	);
}