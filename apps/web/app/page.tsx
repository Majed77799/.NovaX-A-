"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Orb } from './(components)/Orb';

export default function Page() {
	const [showModal, setShowModal] = useState(false);
	useEffect(() => {
		// preload client init if needed
	}, []);
	function onGetStarted() {
		try { document.cookie = 'novax_auth=1; path=/; max-age=86400'; } catch {}
		setShowModal(false);
		window.location.href = '/dashboard';
	}
	return (
		<div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
			<Orb state="idle" />
			<h1 style={{ marginTop: 16, fontSize: 36, fontWeight: 700 }}>NovaX — Playful SaaS, Serious Power</h1>
			<p style={{ marginTop: 8, opacity: 0.9 }}>Build faster with delightful templates and a buttery‑smooth workflow.</p>
			<div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
				<button className="btn" onClick={() => setShowModal(true)}>Get Started</button>
				<Link className="btn" href="/marketplace">Explore Marketplace</Link>
			</div>
			<div className="card" style={{ marginTop: 24 }}>
				<div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
					<span className="badge">Creator Lv.3</span>
					<span className="badge">Top 10%</span>
					<span className="badge">Streak x5</span>
				</div>
				<div style={{ height: 10, borderRadius: 6, background: 'rgba(15,18,35,0.1)' }}>
					<div style={{ width: '72%', height: '100%', borderRadius: 6, background: 'linear-gradient(90deg, #A78BFA, #34D399)' }} />
				</div>
			</div>
			{showModal && (
				<div className="modal" role="dialog" aria-modal="true">
					<div className="modal-content">
						<h3>Sign in</h3>
						<p style={{ marginTop: 6 }}>This is a demo. Continue to enter the dashboard.</p>
						<div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
							<button className="btn" onClick={onGetStarted}>Continue</button>
							<button className="btn" onClick={() => setShowModal(false)}>Cancel</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}