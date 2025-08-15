let ttiMs: number | null = null;

export function setTti(ms: number) {
	ttiMs = ms;
}

export function getTti(): number | null {
	return ttiMs;
}