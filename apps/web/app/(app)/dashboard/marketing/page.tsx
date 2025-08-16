"use client";
import { Button, Card, Input, Select, Textarea } from '@repo/ui';
import { useEffect, useRef, useState } from 'react';

export default function MarketingPage() {
	const [audience, setAudience] = useState('creators');
	const [tone, setTone] = useState('friendly');
	const [lang, setLang] = useState('en');
	const [streaming, setStreaming] = useState(false);
	const [text, setText] = useState('');
	const [tokens, setTokens] = useState(0);
	const controllerRef = useRef<AbortController | null>(null);
	async function generate() {
		setText(''); setTokens(0); setStreaming(true);
		controllerRef.current?.abort();
		const controller = new AbortController();
		controllerRef.current = controller;
		const res = await fetch('/api/marketing/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ audience, tone, lang }), signal: controller.signal });
		if (!res.ok || !res.body) { setStreaming(false); return; }
		const reader = res.body.getReader();
		const decoder = new TextDecoder();
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			const chunk = decoder.decode(value, { stream: true });
			setText(prev => prev + chunk);
			setTokens(prev => prev + chunk.length / 4);
		}
		setStreaming(false);
	}
	return (
		<div className="grid gap-4">
			<Card title="Generate assets" subtitle="Audience, tone, and language">
				<div className="grid md:grid-cols-3 gap-3">
					<Input value={audience} onChange={e => setAudience(e.target.value)} aria-label="Audience" placeholder="Audience" />
					<Select value={tone} onChange={e => setTone(e.target.value)}>
						<option value="friendly">Friendly</option>
						<option value="professional">Professional</option>
						<option value="playful">Playful</option>
					</Select>
					<Select value={lang} onChange={e => setLang(e.target.value)}>
						<option value="en">English</option>
						<option value="es">Spanish</option>
						<option value="fr">French</option>
					</Select>
				</div>
				<div className="mt-3 flex items-center gap-2">
					<Button onClick={generate} disabled={streaming}>{streaming ? 'Generating…' : 'Generate'}</Button>
					<div className="text-sm text-[color:var(--color-text-muted)]">Token estimate: ~{Math.round(tokens)}</div>
					<Button variant="secondary" onClick={() => navigator.clipboard.writeText(text)} disabled={!text}>Copy</Button>
					<Button variant="secondary" onClick={() => download('nvx-marketing.json', JSON.stringify({ audience, tone, lang, text }, null, 2))} disabled={!text}>Export JSON</Button>
				</div>
				<Textarea className="mt-3" value={text} readOnly rows={12} />
			</Card>
		</div>
	);
}

function download(filename: string, data: string) {
	const blob = new Blob([data], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url; a.download = filename; a.click();
	URL.revokeObjectURL(url);
}