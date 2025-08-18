"use client";
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import dynamic from 'next/dynamic';

// Defer optional UI chunk as an example
const InputBar = dynamic(() => import('./(components)/InputBar').then(m => m.InputBar), { ssr: false, loading: () => null });

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
			<InputBar onSend={send} />
		</div>
	);
}