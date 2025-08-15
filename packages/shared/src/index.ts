export type Role = 'user' | 'assistant' | 'system';
export type ChatMessage = { id: string; role: Role; content: string; createdAt?: string; language?: string };

export function createSSEHeaders() {
	return new Headers({ 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache, no-transform', 'X-Accel-Buffering': 'no' });
}

export function detectLanguage(text: string): string {
	// naive detection fallback
	const hasCJK = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/.test(text);
	if (hasCJK) return 'zh';
	if (/[اأإآء-ي]/.test(text)) return 'ar';
	if (/á|é|í|ó|ú|ñ|¿|¡/.test(text)) return 'es';
	return 'en';
}

export function needsTranslation(src: string, dst: string) {
	return src && dst && src !== dst;
}

export function isRTL(lang: string) {
	return ['ar', 'he', 'fa', 'ur'].includes(lang);
}

export function hashAnonymousId(input: string) {
	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		hash = (hash << 5) - hash + input.charCodeAt(i);
		hash |= 0;
	}
	return `u_${Math.abs(hash)}`;
}

// Analytics shared types
export type DateKey = string; // YYYY-MM-DD (UTC)
export type AnalyticsEvent = { t: string; product?: string; value?: number; ts?: number };
export type TimeseriesPoint = { date: DateKey; value: number };
export type AnalyticsSummary = {
	range: { start: DateKey; end: DateKey };
	totalEvents: number;
	activeProducts: number;
	byType: { type: string; total: number }[];
	timeseries: TimeseriesPoint[];
	previousTotal?: number;
	changePct?: number;
};

export type ProductTrend = { product: string; total: number; timeseries: TimeseriesPoint[] };
export type PredictionPoint = { date: DateKey; value: number; kind: 'actual'|'predicted' };
export type PredictionResponse = { basis: 'linear'|'avg'|'none'; horizon: number; series: PredictionPoint[] };

export function formatDateUTC(date: Date): DateKey {
	const y = date.getUTCFullYear();
	const m = `${date.getUTCMonth() + 1}`.padStart(2, '0');
	const d = `${date.getUTCDate()}`.padStart(2, '0');
	return `${y}-${m}-${d}`;
}

export function addDaysUTC(date: Date, days: number): Date {
	const copy = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
	copy.setUTCDate(copy.getUTCDate() + days);
	return copy;
}