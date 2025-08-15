export type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string }

export type AIClientOptions = {
	apiUrl?: string
	apiKey?: string
	mock?: boolean
}

export class AIClient {
	private readonly apiUrl: string
	private readonly apiKey?: string
	private readonly mock: boolean

	constructor(options: AIClientOptions = {}) {
		this.apiUrl = options.apiUrl || process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:4000'
		this.apiKey = options.apiKey || process.env.NOVAX_API_KEY
		this.mock = options.mock ?? !this.apiKey
	}

	async send(messages: ChatMessage[]): Promise<ChatMessage> {
		if (this.mock) {
			const last = messages[messages.length - 1]
			return { role: 'assistant', content: `Mock reply to: ${last?.content ?? ''}` }
		}
		const res = await fetch(`${this.apiUrl}/ai/chat`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				authorization: this.apiKey ? `Bearer ${this.apiKey}` : '',
			},
			body: JSON.stringify({ messages }),
		})
		if (!res.ok) throw new Error(`AI error: ${res.status}`)
		return res.json()
	}

	async generateImage(prompt: string): Promise<string> {
		if (this.mock) {
			return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512'><rect width='100%' height='100%' fill='lightgray'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='24'>${encodeURIComponent(
				prompt,
			)}</text></svg>`
		}
		const res = await fetch(`${this.apiUrl}/ai/image`, {
			method: 'POST',
			headers: { 'content-type': 'application/json', authorization: this.apiKey ? `Bearer ${this.apiKey}` : '' },
			body: JSON.stringify({ prompt }),
		})
		if (!res.ok) throw new Error(`AI image error: ${res.status}`)
		const data = await res.json()
		return data.url as string
	}
}