export async function fetchStripeSalesSummary(baseUrl: string, start?: Date, end?: Date): Promise<{ ok: boolean; totalAmount: number; totalCount: number } | null> {
	try {
		const qs = new URLSearchParams();
		if (start) qs.set('start', String(Math.floor(start.getTime()/1000)));
		if (end) qs.set('end', String(Math.floor(end.getTime()/1000)));
		const res = await fetch(`${baseUrl}/api/sales/summary?${qs.toString()}`);
		if (!res.ok) return null;
		const data = await res.json();
		if (!data.ok) return null;
		return { ok: true, totalAmount: data.totalAmount / 100, totalCount: data.totalCount };
	} catch {
		return null;
	}
}