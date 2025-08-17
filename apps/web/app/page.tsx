"use client";
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import FeedLink from './(components)/FeedLink';

type Message = { id: string; role: 'user'|'assistant'|'system'; content: string };

type OrbState = 'idle'|'thinking'|'speaking';

export default function Page() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');
	const [orb, setOrb] = useState<OrbState>('idle');
	const listRef = useRef<HTMLDivElement>(null);
	const abortRef = useRef<AbortController | null>(null);

	useEffect(() => {
		try {
			const raw = localStorage.getItem('messages');
			if (raw) setMessages(JSON.parse(raw));
		} catch {}
	}, []);
	useEffect(() => {
		try { localStorage.setItem('messages', JSON.stringify(messages)); } catch {}
	}, [messages]);

	useEffect(() => { listRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth' }); }, [messages.length]);

	async function send(text: string) {
		if (!text.trim()) return;
		const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text.trim() };
		setMessages(prev => [...prev, userMsg]);
		setInput('');
		setOrb('thinking');
		abortRef.current?.abort();
		const controller = new AbortController();
		abortRef.current = controller;
		fetch('/api/analytics', { method: 'POST', body: JSON.stringify({ t: 'message', len: text.length }), headers: { 'Content-Type': 'application/json' } }).catch(()=>{});
		const res = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ messages: [...messages, userMsg] }), headers: { 'Content-Type': 'application/json' }, signal: controller.signal });
		if (!res.ok || !res.body) { setOrb('idle'); return; }
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
			setMessages(prev => prev.map(m => (m.id === assistantMsg.id ? assistantMsg : m)));
		}
		setOrb('idle');
	}

	async function speakLast() {
		const last = [...messages].reverse().find(m => m.role === 'assistant');
		if (!last) return;
		setOrb('speaking');
		try {
			const res = await fetch('/api/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: last.content }) });
			const buf = await res.arrayBuffer();
			const blob = new Blob([buf], { type: 'audio/mpeg' });
			const url = URL.createObjectURL(blob);
			const audio = new Audio(url);
			audio.onended = () => { setOrb('idle'); URL.revokeObjectURL(url); };
			audio.play();
		} catch { setOrb('idle'); }
	}

	return (
		<div className="container">
			<div className={clsx('orb', orb)} aria-label={`assistant ${orb}`} />
			<div className="chat" ref={listRef}>
				{messages.map(m => (
					<div key={m.id} className={clsx('bubble', m.role === 'assistant' ? 'assistant' : 'user')}>{m.content}</div>
				))}
			</div>
			<div className="input-bar">
				<div className="input-shell">
					<div className="quick-actions">
						<button className="quick-chip btn" onClick={() => send('Summarize my day in 3 bullet points.')}>Summarize</button>
						<button className="quick-chip btn" onClick={() => send('Translate the last message to Spanish.')}>Translate</button>
						<button className="quick-chip btn" onClick={() => send('Create a to-do list for this week.')}>To‑do</button>
					</div>
					<textarea
						className="input"
						rows={1}
						value={input}
						onChange={e => setInput(e.target.value)}
						onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
						placeholder="Message Ello"
						aria-label="Message Ello"
					/>
					<button className="btn" onClick={() => send(input)} aria-label="Send">➤</button>
					<button className="btn" onClick={speakLast} aria-label="Speak">🔊</button>
				</div>
			</div>
			<FeedLink />
		</div>
	);
}