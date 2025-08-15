import { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Switch, Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import * as Network from 'expo-network';
import { translateText, TranslationLang } from '../src/translation';
import { enqueue } from '../src/offline';
import { webTranscribeOnce } from '../src/stt-web';

interface ChatMessage {
	id: string;
	role: 'user' | 'assistant';
	content: string;
}

export default function ChatScreen() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [input, setInput] = useState('');
	const [isStreaming, setIsStreaming] = useState(false);
	const [enableTTS, setEnableTTS] = useState(true);
	const [enableSTT, setEnableSTT] = useState(false);
	const [translation, setTranslation] = useState<'none' | 'es' | 'fr'>('none');
	const [isOnline, setIsOnline] = useState<boolean>(true);
	const recordingRef = useRef<Audio.Recording | null>(null);

	useEffect(() => {
		Audio.requestPermissionsAsync();
	}, []);

	useEffect(() => {
		const check = async () => {
			const { isConnected } = await Network.getNetworkStateAsync();
			setIsOnline(Boolean(isConnected));
		};
		check();
		const t = setInterval(check, 5000);
		return () => clearInterval(t);
	}, []);

	const startRecording = async () => {
		try {
			await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
			const recording = new Audio.Recording();
			await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
			await recording.startAsync();
			recordingRef.current = recording;
		} catch (e) {
			console.warn('Recording error', e);
		}
	};

	const stopRecording = async () => {
		try {
			const recording = recordingRef.current;
			if (!recording) return;
			await recording.stopAndUnloadAsync();
			recording.getURI();
			// Mock STT: pretend we transcribed something
			if (Platform.OS === 'web') {
				const text = await webTranscribeOnce();
				setInput(prev => prev + (prev ? ' ' : '') + text);
			} else {
				setInput(prev => prev + (prev ? ' ' : '') + 'Voice input');
			}
			recordingRef.current = null;
		} catch (e) {
			console.warn('Stop recording error', e);
		}
	};

	const send = async () => {
		if (!input.trim()) return;
		const userMessage: ChatMessage = { id: Date.now() + '-u', role: 'user', content: input.trim() };
		setMessages(prev => [...prev, userMessage]);
		setInput('');
		if (!isOnline) {
			await enqueue({ type: 'message', payload: userMessage });
			return;
		}

		// Streaming mock response
		setIsStreaming(true);
		const assistantId = Date.now() + '-a';
		let accumulated = '';
		const chunks = ['Hello', ', ', 'this ', 'is ', 'a ', 'streamed ', 'response.'];
		for (const chunk of chunks) {
			await new Promise(r => setTimeout(r, 10));
			accumulated += chunk;
			const translatedChunk = translateText(accumulated, translation as TranslationLang);
			setMessages(prev => {
				const others = prev.filter(m => m.id !== assistantId);
				return [...others, { id: assistantId, role: 'assistant', content: translatedChunk }];
			});
		}
		setIsStreaming(false);

		const final = translateText(accumulated, translation as TranslationLang);
		if (enableTTS) Speech.speak(final, { language: translation === 'es' ? 'es-ES' : translation === 'fr' ? 'fr-FR' : undefined });
	};

	return (
		<View style={styles.container}>
			<View style={styles.row}>
				<Text>TTS</Text>
				<Switch value={enableTTS} onValueChange={setEnableTTS} />
				<Text>STT</Text>
				<Switch value={enableSTT} onValueChange={async v => { setEnableSTT(v); if (v) { await startRecording(); } else { await stopRecording(); } }} />
				<Text>Tr:</Text>
				<Button title="None" onPress={() => setTranslation('none')} />
				<Button title="ES" onPress={() => setTranslation('es')} />
				<Button title="FR" onPress={() => setTranslation('fr')} />
			</View>
			<FlatList
				data={messages}
				keyExtractor={item => item.id}
				renderItem={({ item }) => (
					<View style={[styles.bubble, item.role === 'user' ? styles.user : styles.assistant]}>
						<Text>{item.content}</Text>
					</View>
				)}
				style={{ flex: 1, width: '100%' }}
			/>
			<View style={styles.row}>
				<TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="Type a message" />
				<Button title={isStreaming ? '...' : 'Send'} onPress={send} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 12, paddingTop: 40, gap: 8 },
	row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
	input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8 },
	bubble: { marginVertical: 6, padding: 10, borderRadius: 8, alignSelf: 'flex-start', maxWidth: '80%' },
	user: { backgroundColor: '#d1f7c4', alignSelf: 'flex-end' },
	assistant: { backgroundColor: '#f1f1f1' },
});