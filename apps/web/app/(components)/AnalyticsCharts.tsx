"use client";
import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';

type Summary = {
	range: { start: string; end: string };
	totalEvents: number;
	activeProducts: number;
	byType: { type: string; total: number }[];
	timeseries: { date: string; value: number }[];
	previousTotal?: number;
	changePct?: number;
};

type ProductTrend = { product: string; total: number; timeseries: { date: string; value: number }[] };

type Prediction = { basis: string; horizon: number; series: { date: string; value: number; kind: 'actual'|'predicted' }[] };

export default function AnalyticsCharts() {
	const [days, setDays] = useState(14);
	const [summary, setSummary] = useState<Summary | null>(null);
	const [products, setProducts] = useState<ProductTrend[]>([]);
	const [prediction, setPrediction] = useState<Prediction | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => { (async () => {
		setLoading(true);
		try {
			const [s, p, pr] = await Promise.all([
				fetch(`/api/analytics?days=${days}`).then(r => r.json()),
				fetch(`/api/analytics/products?days=${days}`).then(r => r.json()),
				fetch(`/api/analytics/predict?days=${days}&horizon=7`).then(r => r.json())
			]);
			setSummary(s);
			setProducts(p);
			setPrediction(pr);
		} finally {
			setLoading(false);
		}
	})() }, [days]);

	const maxY = useMemo(() => Math.max(1, ...(summary?.timeseries.map(p => p.value) ?? [1])), [summary]);
	const predMaxY = useMemo(() => Math.max(1, ...(prediction?.series.map(p => p.value) ?? [1])), [prediction]);

	return (
		<div className="container" style={{ paddingTop: 24, paddingBottom: 24 }}>
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
				<h2 style={{ margin: 0 }}>Market Analytics</h2>
				<div style={{ display: 'flex', gap: 8 }}>
					{[7,14,30].map(d => (
						<button key={d} className={clsx('btn', 'quick-chip')} aria-pressed={days===d} onClick={() => setDays(d)}>{d}d</button>
					))}
				</div>
			</div>
			{loading && <div className="bubble assistant">Loading…</div>}
			{summary && (
				<div style={{ display: 'grid', gap: 12 }}>
					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
						<Stat title="Total events" value={formatNumber(summary.totalEvents)} sub={formatRange(summary.range.start, summary.range.end)} change={summary.changePct} />
						<Stat title="Active products" value={`${summary.activeProducts}`} sub="Unique products" />
						<Stat title="Top type" value={summary.byType[0]?.type ?? '—'} sub={`${formatNumber(summary.byType[0]?.total ?? 0)} events`} />
					</div>
					<Card>
						<strong>Daily activity</strong>
						<Sparkline points={summary.timeseries} height={80} maxY={maxY} gradient={["#6aa7ff","#b26aff"]} />
					</Card>
					<Card>
						<strong>Products</strong>
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
							{products.map(p => (
								<div key={p.product} className="bubble assistant" style={{ background: 'rgba(255,255,255,0.55)' }}>
									<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
										<span style={{ fontWeight: 600 }}>{capitalize(p.product)}</span>
										<span>{formatNumber(p.total)}</span>
									</div>
									<Sparkline points={p.timeseries} height={48} maxY={Math.max(1, ...p.timeseries.map(x => x.value))} gradient={["#9cc2ff","#5d6cff"]} />
								</div>
							))}
						</div>
					</Card>
					{prediction && (
						<Card>
							<strong>Prediction</strong>
							<Sparkline points={prediction.series.map(p => ({ date: p.date, value: p.value }))} height={80} maxY={predMaxY} gradient={["#b26aff","#6aa7ff"]} dashedAfter={summary.timeseries.length - 1} />
							<div style={{ opacity: 0.8, fontSize: 12 }}>Basis: {prediction.basis}</div>
						</Card>
					)}
				</div>
			)}
		</div>
	);
}

function Card({ children }: { children: React.ReactNode }) {
	return (
		<div style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 16, padding: 12, boxShadow: 'var(--shadow)' }}>
			{children}
		</div>
	);
}

function Stat({ title, value, sub, change }: { title: string; value: string; sub?: string; change?: number }) {
	const pos = change !== undefined ? change >= 0 : undefined;
	return (
		<Card>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<span style={{ opacity: 0.7, fontSize: 12 }}>{title}</span>
				<span style={{ fontSize: 24, fontWeight: 700 }}>{value}</span>
				{sub && <span style={{ opacity: 0.7, fontSize: 12 }}>{sub}</span>}
				{pos !== undefined && (
					<span style={{ fontSize: 12, color: pos ? '#0a7a4b' : '#a11828' }}>{pos ? '▲' : '▼'} {Math.abs(change!).toFixed(1)}%</span>
				)}
			</div>
		</Card>
	);
}

function Sparkline({ points, height, maxY, gradient, dashedAfter }: { points: { date: string; value: number }[]; height: number; maxY: number; gradient: [string,string]; dashedAfter?: number }) {
	const width = Math.max(240, points.length * 10);
	return (
		<svg role="img" width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
			<defs>
				<linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0%" stopColor={gradient[0]} />
					<stop offset="100%" stopColor={gradient[1]} />
				</linearGradient>
			</defs>
			<polyline fill="none" stroke="url(#g)" strokeWidth="2" points={points.map((p, i) => `${(i/(points.length-1))*width},${height - (p.value/maxY)*height}`).join(' ')} strokeDasharray={dashedAfter !== undefined ? `${(dashedAfter/(points.length-1))*width} ${width}` : undefined} />
		</svg>
	);
}

function capitalize(s: string) { return s.slice(0,1).toUpperCase() + s.slice(1); }
function formatNumber(n: number) { return new Intl.NumberFormat().format(n); }
function formatRange(s: string, e: string) { return `${new Date(s).toLocaleDateString()} – ${new Date(e).toLocaleDateString()}`; }