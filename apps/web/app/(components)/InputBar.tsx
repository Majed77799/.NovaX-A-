"use client";
import { useState } from 'react';
import { Button, Input, Textarea } from '@repo/ui';

export default function InputBar({ onSend, onSpeak }: { onSend: (text: string) => void; onSpeak: () => void }) {
	const [input, setInput] = useState('');
	return (
		<div className="input-bar">
			<div className="input-shell">
				<div className="quick-actions">
					<button className="quick-chip btn" onClick={() => onSend('Summarize my day in 3 bullet points.')}>Summarize</button>
					<button className="quick-chip btn" onClick={() => onSend('Translate the last message to Spanish.')}>Translate</button>
					<button className="quick-chip btn" onClick={() => onSend('Create a to-do list for this week.')}>To‑do</button>
				</div>
				<Textarea className="input" rows={1} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(input); setInput(''); } }} placeholder="Message" aria-label="Message" />
				<Button variant="ghost" onClick={() => { onSend(input); setInput(''); }} aria-label="Send">➤</Button>
				<Button variant="ghost" onClick={onSpeak} aria-label="Speak">🔊</Button>
			</div>
		</div>
	);
}