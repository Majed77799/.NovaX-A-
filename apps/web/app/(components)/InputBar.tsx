"use client";
import { useState } from 'react';

export function InputBar({ onSend }: { onSend: (text: string) => void }) {
	const [value, setValue] = useState('');
	return (
		<div className="input-bar">
			<div className="input-shell">
				<div className="quick-actions">
					<button className="quick-chip btn" onClick={() => onSend('Summarize my day in 3 bullet points.')}>Summarize</button>
					<button className="quick-chip btn" onClick={() => onSend('Translate the last message to Spanish.')}>Translate</button>
					<button className="quick-chip btn" onClick={() => onSend('Create a to-do list for this week.')}>To‑do</button>
				</div>
				<textarea className="input" rows={1} value={value} onChange={e => setValue(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(value); setValue(''); } }} placeholder="Message Ello" aria-label="Message Ello" />
				<button className="btn" onClick={() => { onSend(value); setValue(''); }} aria-label="Send">➤</button>
			</div>
		</div>
	);
}