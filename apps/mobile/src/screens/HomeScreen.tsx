import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import Orb, { OrbState } from '../components/Orb';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInUp } from 'react-native-reanimated';

export type Message = { id: string; role: 'user'|'assistant'|'system'; content: string };

export default function HomeScreen() {
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
		<GradientBackground>
			<SafeAreaView style={{ flex: 1 }}>
				<View className="items-center py-3">
					<Orb state={orb} />
				</View>
				<ScrollView ref={scrollRef} contentContainerStyle={{ padding: 16, paddingBottom: 140 }}>
					{messages.map(m => (
						<Animated.View entering={FadeInUp.duration(180)} key={m.id} className={`max-w-[80%] rounded-2xl px-3.5 py-3 mb-2 ${m.role==='assistant' ? 'bg-white/50 border border-white/25 self-start' : 'bg-white self-end'}`}>
							<Text className="text-base leading-5 font-urbanist">{m.content}</Text>
						</Animated.View>
					))}
				</ScrollView>
				<View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16 }}>
					<View className="bg-white rounded-full border border-black/5 p-2 shadow">
						<View className="flex-row items-end gap-2">
							<View className="flex-row gap-1.5">
								<QuickChip label="Summarize" onPress={() => send('Summarize my day in 3 bullet points.')} />
								<QuickChip label="Translate" onPress={() => send('Translate the last message to Spanish.')} />
								<QuickChip label="To‑do" onPress={() => send('Create a to-do list for this week.')} />
							</View>
							<TouchableOpacity activeOpacity={0.8} className="px-2 py-2">
								<Text>🎤</Text>
							</TouchableOpacity>
							<TextInput
								className="flex-1 px-3 py-2 max-h-40 font-urbanist"
								value={input}
								multiline
								onChangeText={setInput}
								onSubmitEditing={() => send(input)}
								placeholder="Message NovaX"
							/>
							<TouchableOpacity onPress={() => send(input)} activeOpacity={0.8} className="px-3 py-2">
								<Text>➤</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</SafeAreaView>
		</GradientBackground>
	);
}

function QuickChip({ label, onPress }: { label: string; onPress: () => void }) {
	return (
		<TouchableOpacity onPress={onPress} activeOpacity={0.7} className="bg-white/70 border border-white/25 rounded-full px-2.5 py-1.5 active:scale-95">
			<Text className="text-xs">{label}</Text>
		</TouchableOpacity>
	);
}