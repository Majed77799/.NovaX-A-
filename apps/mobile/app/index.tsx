import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';

type Message = { id: string; role: 'user'|'assistant'|'system'; content: string };

type OrbState = 'idle'|'thinking'|'speaking';

export default function Index() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');
	const [orb, setOrb] = useState<OrbState>('idle');
	const scrollRef = useRef<ScrollView>(null);
	useEffect(() => { scrollRef.current?.scrollToEnd({ animated: true }); }, [messages.length]);
	async function send(text: string) {
		if (!text.trim()) return;
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text.trim() };
		setMessages(prev => [...prev, userMsg]);
		setInput('');
		setOrb('thinking');
		try {
			const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : undefined as any;
			const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ messages: [...messages, userMsg] }) });
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
		<View style={{ flex: 1 }}>
			<View style={{ height: 96, width: 96, borderRadius: 48, margin: 12, backgroundColor: 'rgba(255,255,255,0.35)' }} />
			<ScrollView ref={scrollRef} contentContainerStyle={{ padding: 16, paddingBottom: 140 }}>
				{messages.map(m => (
					<View key={m.id} style={{ maxWidth: '80%', alignSelf: m.role === 'assistant' ? 'flex-start' : 'flex-end', backgroundColor: m.role === 'assistant' ? 'rgba(255,255,255,0.5)' : '#fff', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, marginBottom: 10, borderWidth: m.role==='assistant'?1:0, borderColor: 'rgba(255,255,255,0.25)' }}>
						<Text style={{ fontSize: 16, lineHeight: 22 }}>{m.content}</Text>
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
					<TextInput style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 8, maxHeight: 24*4 }} value={input} multiline onChangeText={setInput} onSubmitEditing={() => send(input)} placeholder="Message Ello" />
					<TouchableOpacity onPress={() => send(input)} activeOpacity={0.8} style={{ paddingHorizontal: 12, paddingVertical: 8 }}><Text>➤</Text></TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

function QuickChip({ label, onPress }: { label: string; onPress: () => void }) {
	return (
		<TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 }}>
			<Text style={{ fontSize: 12 }}>{label}</Text>
		</TouchableOpacity>
	);
}