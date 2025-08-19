"use client";
import { useState, useEffect } from 'react';

export default function Settings() {
	const [theme, setTheme] = useState<'system'|'light'|'dark'>('system');
	const [fontSize, setFontSize] = useState<number>(16);
	const [language, setLanguage] = useState<string>('auto');
	const [voice, setVoice] = useState<string>('alloy');

	const applySettings = (t: 'system'|'light'|'dark', size: number) => {
		const root = document.documentElement;
		root.style.setProperty('--font-size', `${size}px`);
		if (t === 'system') {
			root.removeAttribute('data-theme');
		} else {
			root.setAttribute('data-theme', t);
		}
	};

	useEffect(() => {
		try {
			const raw = localStorage.getItem('novax:settings');
			if (raw) {
				const s = JSON.parse(raw);
				setTheme(s.theme ?? 'system');
				setFontSize(s.fontSize ?? 16);
				setLanguage(s.language ?? 'auto');
				setVoice(s.voice ?? 'alloy');
				applySettings(s.theme ?? 'system', s.fontSize ?? 16);
			}
		} catch {}
	}, []);

	useEffect(() => {
		applySettings(theme, fontSize);
		try { localStorage.setItem('novax:settings', JSON.stringify({ theme, fontSize, language, voice })); } catch {}
	}, [theme, fontSize, language, voice]);

	return (
		<div className="container" style={{ paddingTop: 32 }}>
			<h2>Settings</h2>
			<div style={{ display: 'grid', gap: 16 }}>
				<label>Theme
					<select value={theme} onChange={e=>setTheme(e.target.value as any)}>
						<option value="system">System</option>
						<option value="light">Light</option>
						<option value="dark">Dark</option>
					</select>
				</label>
				<label>Font size
					<input type="number" value={fontSize} onChange={e=>setFontSize(parseInt(e.target.value||'16'))} />
				</label>
				<label>Language
					<select value={language} onChange={e=>setLanguage(e.target.value)}>
						<option value="auto">Auto</option>
						<option value="en">English</option>
						<option value="es">Español</option>
						<option value="ar">العربية (RTL)</option>
					</select>
				</label>
				<label>Voice
					<select value={voice} onChange={e=>setVoice(e.target.value)}>
						<option value="alloy">Alloy</option>
						<option value="verse">Verse</option>
					</select>
				</label>
				<section>
					<h3>API keys</h3>
					<p>Set on server via environment variables.</p>
				</section>
				<section>
					<h3>Debug</h3>
					<p>Status OK.</p>
				</section>
			</div>
		</div>
	);
}