import { NextRequest } from 'next/server';
import parser from 'accept-language-parser';
import { SUPPORTED_LANGS, normalizeLang } from '../../../i18n/config';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
	const accept = req.headers.get('accept-language') || '';
	const parsed = parser.parse(accept);
	let lang: string | null = null;
	for (const pref of parsed) {
		const code = `${pref.code}${pref.region ? '-' + pref.region : ''}`;
		const norm = normalizeLang(code);
		if (SUPPORTED_LANGS.includes(norm)) { lang = norm; break; }
	}
	if (!lang) lang = 'en';
	return Response.json({ lang });
}