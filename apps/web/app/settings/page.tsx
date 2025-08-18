"use client";
import { useState } from 'react';
import dynamic from 'next/dynamic';

// Example: route-level dynamic import of a heavy component (charts, editors, etc.)
const HeavyCharts = dynamic(() => import('../(components)/HeavyCharts'), {
	ssr: false,
	loading: () => <div style={{ opacity: 0.6 }}>Loading analytics…</div>
});

export default function Settings() {
	const [theme, setTheme] = useState<'system'|'light'|'dark'>('system');
	const [fontSize, setFontSize] = useState<number>(16);
	const [language, setLanguage] = useState<string>('auto');
	const [voice, setVoice] = useState<string>('alloy');
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
				<section>
					<h3>Usage analytics (lazy)</h3>
					<HeavyCharts />
				</section>
			</div>
		</div>
	);
}