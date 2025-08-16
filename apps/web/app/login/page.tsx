"use client";
import { useState, useEffect } from 'react';

export default function Login() {
	const [email, setEmail] = useState('demo@example.com');
	const [password, setPassword] = useState('password');
	const [error, setError] = useState('');
	useEffect(() => {
		const hash = typeof window !== 'undefined' ? window.location.hash : '';
		if (hash?.startsWith('#token=')) {
			const token = decodeURIComponent(hash.slice('#token='.length));
			localStorage.setItem('auth_token', token);
			window.location.replace('/dashboard');
		}
	}, []);
	async function login() {
		setError('');
		try {
			const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
			if (!res.ok) throw new Error('Login failed');
			const data = await res.json();
			localStorage.setItem('auth_token', data.token);
			window.location.href = '/dashboard';
		} catch (e: any) { setError(e.message || 'Login failed'); }
	}
	async function google() {
		const res = await fetch('/api/auth/google');
		const data = await res.json();
		window.location.href = data.url;
	}
	return (
		<div className="container" style={{ paddingTop: 24 }}>
			<h2>Login</h2>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<div style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
				<input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
				<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
				<button className="btn" onClick={login}>Login</button>
				<button className="btn" onClick={google}>Continue with Google</button>
			</div>
		</div>
	);
}