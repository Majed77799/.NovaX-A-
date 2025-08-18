"use client";
import { useEffect, useMemo, useState } from 'react';

// Lightweight placeholder simulating a heavy client component that benefits from dynamic import
export default function HeavyCharts() {
	const [data, setData] = useState<number[]>([]);
	useEffect(() => {
		const arr = Array.from({ length: 1000 }, (_, i) => Math.round(Math.sin(i / 10) * 50 + 50));
		setData(arr);
	}, []);
	const avg = useMemo(() => (data.length ? data.reduce((a, b) => a + b, 0) / data.length : 0), [data]);
	return (
		<div style={{ background: '#fff', borderRadius: 12, padding: 12, border: '1px solid rgba(15,18,35,0.08)' }}>
			<p style={{ margin: 0 }}>Data points: {data.length}</p>
			<p style={{ margin: '6px 0 0 0' }}>Average: {avg.toFixed(2)}</p>
		</div>
	);
}

