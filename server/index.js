import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { z } from 'zod';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MessageSchema = z.object({
	id: z.string().optional(),
	role: z.enum(['user', 'assistant', 'system']).default('user'),
	lang: z.enum(['en', 'ar', 'auto']).default('en'),
	text: z.string(),
	translated: z
		.object({
			lang: z.enum(['en', 'ar']),
			text: z.string(),
			via: z.enum(['google', 'libre', 'fallback']).optional(),
			detectedSrcLang: z.enum(['en', 'ar']).optional(),
		})
		.optional(),
	meta: z.record(z.any()).optional(),
});

const TranslateBodySchema = z.object({
	text: z.string().min(1),
	source: z.enum(['en', 'ar', 'auto']).optional(),
	target: z.enum(['en', 'ar']).default('ar'),
});

async function translateViaLibre(text, source, target) {
	const url = process.env.LIBRE_TRANSLATE_URL || 'https://libretranslate.com/translate';
	const payload = { q: text, source: source || 'auto', target, format: 'text' };
	const headers = {};
	if (process.env.LIBRE_TRANSLATE_API_KEY) {
		payload.api_key = process.env.LIBRE_TRANSLATE_API_KEY;
	}
	const { data } = await axios.post(url, payload, { headers, timeout: 15000 });
	if (typeof data?.translatedText === 'string') {
		const detectedSrcLang = typeof data?.detectedLanguage === 'string' ? (data.detectedLanguage.startsWith('ar') ? 'ar' : 'en') : undefined;
		return { text: data.translatedText, detectedSrcLang };
	}
	throw new Error('Unexpected LibreTranslate response');
}

async function translateViaGoogle(text, target, source) {
	// Using Google Translate web endpoint is brittle. Prefer official API if key provided.
	const googleApiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
	if (!googleApiKey) throw new Error('No GOOGLE_TRANSLATE_API_KEY');
	const url = `https://translation.googleapis.com/language/translate/v2?key=${googleApiKey}`;
	const body = { q: text, target, format: 'text' };
	if (source) body.source = source;
	const { data } = await axios.post(url, body, { timeout: 15000 });
	const translated = data?.data?.translations?.[0]?.translatedText;
	const detected = data?.data?.translations?.[0]?.detectedSourceLanguage;
	if (!translated) throw new Error('Unexpected Google response');
	const detectedSrcLang = typeof detected === 'string' ? (detected.startsWith('ar') ? 'ar' : 'en') : undefined;
	return { text: translated, detectedSrcLang };
}

async function translateBest(text, source, target) {
	// Try Google if configured, else LibreTranslate, else graceful fallback (no-op)
	try {
		if (process.env.GOOGLE_TRANSLATE_API_KEY) {
			const out = await translateViaGoogle(text, target, source);
			return { ...out, via: 'google' };
		}
	} catch (err) {
		// continue to other providers
	}
	try {
		const out = await translateViaLibre(text, source, target);
		return { ...out, via: 'libre' };
	} catch (err) {
		return { text, via: 'fallback' };
	}
}

app.post('/translate', async (req, res) => {
	try {
		const body = TranslateBodySchema.parse(req.body);
		const { text, source, target } = body;
		const { text: translatedText, via, detectedSrcLang } = await translateBest(text, source, target);
		return res.json({ translatedText, via, detectedSrcLang });
	} catch (err) {
		return res.status(400).json({ error: err?.message || 'Bad request' });
	}
});

app.post('/messages', async (req, res) => {
	try {
		const incoming = MessageSchema.parse(req.body);
		// Auto-translate to the alternate language
		function isProbablyArabic(str) {
			return /[\u0600-\u06FF]/.test(str);
		}

		if (incoming.lang === 'auto') {
			// Try translating to AR first; if source detected as AR, switch to EN
			let first = await translateBest(incoming.text, 'auto', 'ar');
			let final = first;
			let finalTarget = 'ar';
			let detected = first.detectedSrcLang;
			if ((detected && detected === 'ar') || (!detected && isProbablyArabic(incoming.text))) {
				final = await translateBest(incoming.text, 'auto', 'en');
				finalTarget = 'en';
			}
			const message = {
				...incoming,
				translated: { lang: finalTarget, text: final.text, via: final.via, detectedSrcLang: detected || final.detectedSrcLang },
			};
			return res.json({ message });
		}

		const target = incoming.lang === 'en' ? 'ar' : 'en';
		const { text: translatedText, via, detectedSrcLang } = await translateBest(incoming.text, incoming.lang, target);
		const message = {
			...incoming,
			translated: { lang: target, text: translatedText, via, detectedSrcLang },
		};
		return res.json({ message });
	} catch (err) {
		return res.status(400).json({ error: err?.message || 'Bad request' });
	}
});

const port = parseInt(process.env.PORT || '3001', 10);
app.listen(port, () => {
	console.log(`Translation server listening on http://localhost:${port}`);
});