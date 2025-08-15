export interface ChatMessage {
	id: string;
	role: 'user' | 'assistant';
	content: string;
}

export interface StreamOptions {
	delayMsPerChunk?: number;
}

function generateId(): string {
	return `msg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function sendMessage(text: string): Promise<ChatMessage> {
	return {
		id: generateId(),
		role: 'assistant',
		content: `Echo: ${text}`,
	};
}

export async function* streamMessage(text: string, options: StreamOptions = {}): AsyncGenerator<string> {
	const chunks = [`Echo`, `: `, text];
	for (const chunk of chunks) {
		if (options.delayMsPerChunk && options.delayMsPerChunk > 0) {
			await new Promise((r) => setTimeout(r, options.delayMsPerChunk));
		}
		yield chunk;
	}
}