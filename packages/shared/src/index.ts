export const getEnv = (key: string, fallback?: string) => {
	if (typeof process !== 'undefined' && process.env && key in process.env) {
		return process.env[key] ?? fallback
	}
	if (typeof window !== 'undefined') {
		return (window as any).__ENV__?.[key] ?? fallback
	}
	return fallback
}

export const API_URL = getEnv('API_URL', 'http://localhost:4000')