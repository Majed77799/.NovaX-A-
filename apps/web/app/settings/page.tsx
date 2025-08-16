"use client";
import { useState } from 'react';

export default function Settings() {
	const [theme, setTheme] = useState<'system'|'light'|'dark'>('system');
	const [fontSize, setFontSize] = useState<number>(16);
	const [language, setLanguage] = useState<string>('auto');
	const [voice, setVoice] = useState<string>('alloy');
	const [method, setMethod] = useState<'stripe'|'paypal'|'crypto'|'wise'>('stripe');
	const [web3, setWeb3] = useState<boolean>(false);
	const [status, setStatus] = useState<string>('');

	async function startCheckout() {
		setStatus('');
		const res = await fetch('/api/payments/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ method, amount: 2500, currency: 'USD', name: 'NovaX Pro' }) });
		if (!res.ok) { setStatus('Failed to init payment'); return; }
		const data = await res.json();
		if (data.instructions) {
			setStatus(data.instructions);
			return;
		}
		if (data.url) window.location.href = data.url;
	}

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
					<h3>Payments</h3>
					<label>Method
						<select value={method} onChange={e=>setMethod(e.target.value as any)}>
							<option value="stripe">Stripe</option>
							<option value="paypal">PayPal (fallback to Stripe)</option>
							<option value="crypto">Crypto (Coinbase)</option>
							<option value="wise">Wise (bank transfer)</option>
						</select>
					</label>
					<button onClick={startCheckout}>Purchase NovaX Pro ($25)</button>
					{status && <p style={{ whiteSpace: 'pre-wrap' }}>{status}</p>}
				</section>
				<section>
					<h3>Web3</h3>
					<label><input type="checkbox" checked={web3} onChange={e=>setWeb3(e.target.checked)} /> Enable Web3 mode (testnet)</label>
				</section>
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