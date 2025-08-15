import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

export type Provider = 'openai' | 'anthropic' | 'gemini';
export type StreamHandler = (token: string) => void;

export type ProviderConfig = {
	model?: string;
	maxTokens?: number;
	temperature?: number;
};

export type GenerateOptions = ProviderConfig & {
	messages: { role: 'system'|'user'|'assistant'; content: string }[];
	onToken?: StreamHandler;
	signal?: AbortSignal;
	preferred?: Provider[];
};

const costHint: Record<Provider, number> = { openai: 1, anthropic: 1.1, gemini: 0.9 };

export async function generateStreaming(opts: GenerateOptions): Promise<void> {
	const ordered = orderProviders(opts.preferred);
	for (const p of ordered) {
		try {
			await streamFromProvider(p, opts);
			return;
		} catch (err) {
			if ((err as any)?.name === 'AbortError') throw err;
			continue;
		}
	}
	throw new Error('All providers failed');
}

function orderProviders(preferred?: Provider[]): Provider[] {
	const base: Provider[] = preferred && preferred.length ? preferred : ['openai','anthropic','gemini'];
	return base.sort((a,b) => costHint[a] - costHint[b]);
}

async function streamFromProvider(provider: Provider, opts: GenerateOptions) {
	switch (provider) {
		case 'openai':
			return streamOpenAI(opts);
		case 'anthropic':
			return streamAnthropic(opts);
		case 'gemini':
			return streamGemini(opts);
	}
}

async function streamOpenAI(opts: GenerateOptions) {
	const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
	const model = opts.model ?? 'gpt-4o-mini';
	const response = await client.chat.completions.create({
		model,
		messages: opts.messages,
		stream: true,
		temperature: opts.temperature ?? 0.7,
		max_tokens: opts.maxTokens ?? 1024
	}, { signal: opts.signal });
	for await (const chunk of response) {
		const delta = chunk.choices?.[0]?.delta?.content ?? '';
		if (delta && opts.onToken) opts.onToken(delta);
	}
}

async function streamAnthropic(opts: GenerateOptions) {
	const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
	const model = opts.model ?? 'claude-3-haiku-20240307';
	const stream = await client.messages.stream({
		model,
		max_tokens: opts.maxTokens ?? 1024,
		temperature: opts.temperature ?? 0.7,
		messages: opts.messages.map(m => ({ role: m.role, content: m.content })) as any
	}, { signal: opts.signal });
	for await (const event of stream) {
		const delta = (event as any)?.delta?.text ?? (event as any)?.text ?? '';
		if (delta && opts.onToken) opts.onToken(delta);
	}
}

async function streamGemini(opts: GenerateOptions) {
	const apiKey = process.env.GOOGLE_API_KEY;
	const genAI = new GoogleGenerativeAI(apiKey!);
	const modelName = opts.model ?? 'gemini-1.5-flash';
	const model = genAI.getGenerativeModel({ model: modelName });
	const chat = model.startChat({ history: opts.messages.map(m => ({ role: m.role, parts: [{ text: m.content }] })) as any });
	const res = await chat.sendMessageStream(opts.messages[opts.messages.length - 1]!.content);
	for await (const chunk of res.stream) {
		const text = chunk.text();
		if (text && opts.onToken) opts.onToken(text);
	}
}