import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import type { TranslateRequest, TranslateResponse, VoiceRequest, VoiceResponse, ImageRequest, ImageResponse, Template } from '@novax/core';
import { isMockEnabled } from '@novax/core';

dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
const mock = isMockEnabled(process.env);

app.get('/health', (_req, res) => {
	res.json({ ok: true, mock });
});

app.get('/templates', (_req, res) => {
	const templates: Template[] = [
		{ id: 'welcome', name: 'Welcome', content: 'Hello, {{name}}!' }
	];
	res.json(templates);
});

app.post('/translate', (req, res) => {
	const body = req.body as TranslateRequest;
	if (mock) {
		const response: TranslateResponse = { translatedText: `[mock:${body.targetLang}] ${body.text}`, provider: 'mock', mock: true };
		return res.json(response);
	}
	return res.status(501).json({ message: 'Provider not configured', code: 'NO_PROVIDER' });
});

app.post('/voice', (req, res) => {
	const body = req.body as VoiceRequest;
	if (mock) {
		const response: VoiceResponse = { audioBase64: Buffer.from(`mock audio for ${body.text}`).toString('base64'), provider: 'mock', mock: true };
		return res.json(response);
	}
	return res.status(501).json({ message: 'Provider not configured', code: 'NO_PROVIDER' });
});

app.post('/image', (req, res) => {
	const body = req.body as ImageRequest;
	if (mock) {
		const response: ImageResponse = { imageBase64: Buffer.from(`mock image for ${body.prompt}`).toString('base64'), provider: 'mock', mock: true };
		return res.json(response);
	}
	return res.status(501).json({ message: 'Provider not configured', code: 'NO_PROVIDER' });
});

app.listen(port, () => {
	console.log(`API listening on http://localhost:${port} (mock=${mock})`);
});