import { useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AnalyticsParams = { metric: string; range: string; [key: string]: any };

export type AnalyticsData = {
	kpis: Array<{ id: string; label: string; value: string | number; delta: number; sparkline: number[] }>;
	series: number[];
	updatedAt: number;
};

type State = {
	data?: AnalyticsData;
	isLoading: boolean;
	isOfflineSnapshot: boolean;
	snapshotTimestamp?: string;
	error?: Error;
};

const inflight: Record<string, Promise<AnalyticsData>> = {};
const cache: Record<string, AnalyticsData> = {};

const STORAGE_PREFIX = 'analytics:';

async function fetchAnalytics(params: AnalyticsParams): Promise<AnalyticsData> {
	// Replace with real API call
	await new Promise(r => setTimeout(r, 300));
	const now = Date.now();
	return {
		kpis: [
			{ id: 'sales', label: 'Sales', value: '$120k', delta: 5.2, sparkline: gen(30, 80, 120) },
			{ id: 'orders', label: 'Orders', value: 1340, delta: -1.8, sparkline: gen(30, 20, 50) },
			{ id: 'aov', label: 'AOV', value: '$89', delta: 0.0, sparkline: gen(30, 60, 100) }
		],
		series: gen(90, 50, 150),
		updatedAt: now
	};
}

function gen(n: number, min: number, max: number) {
	return Array.from({ length: n }, () => Math.round(min + Math.random() * (max - min)));
}

function keyOf(params: AnalyticsParams) {
	return JSON.stringify(params);
}

export function useAnalyticsData(params: AnalyticsParams): State {
	const key = useMemo(() => keyOf(params), [params]);
	const [state, setState] = useState<State>({ isLoading: true, isOfflineSnapshot: false });
	const mounted = useRef(true);

	useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
		};
	}, []);

	useEffect(() => {
		let cancelled = false;
		async function load() {
			setState(s => ({ ...s, isLoading: true, error: undefined }));

			// 1) Return in-memory cache fast
			if (cache[key]) {
				setState({ data: cache[key], isLoading: false, isOfflineSnapshot: false, snapshotTimestamp: undefined });
			}

			// 2) Try network with dedupe
			try {
				if (!inflight[key]) {
					inflight[key] = fetchAnalytics(params).finally(() => { delete inflight[key]; });
				}
				const fresh = await inflight[key];
				if (cancelled) return;
				cache[key] = fresh;
				await AsyncStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(fresh));
				if (mounted.current) setState({ data: fresh, isLoading: false, isOfflineSnapshot: false, snapshotTimestamp: undefined });
				return;
			} catch (e) {
				// continue to offline
			}

			// 3) Offline: load last snapshot
			try {
				const raw = await AsyncStorage.getItem(STORAGE_PREFIX + key);
				if (!raw) throw new Error('no snapshot');
				const snapshot: AnalyticsData = JSON.parse(raw);
				if (mounted.current) setState({ data: snapshot, isLoading: false, isOfflineSnapshot: true, snapshotTimestamp: new Date(snapshot.updatedAt).toLocaleString() });
			} catch (e: any) {
				if (mounted.current) setState(s => ({ ...s, isLoading: false, error: e }));
			}
		}
		load();
		return () => { cancelled = true; };
	}, [key]);

	return state;
}