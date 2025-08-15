# Multilingual Translation Server (EN/AR + auto)

Endpoints:
- POST /translate { text, source?: 'en'|'ar'|'auto', target: 'en'|'ar' }
  - -> { translatedText, via: 'google'|'libre'|'fallback', detectedSrcLang?: 'en'|'ar' }
- POST /messages { role: 'user'|'assistant'|'system', lang: 'en'|'ar'|'auto', text }
  - -> { message: { role, lang, text, translated: { lang, text, via, detectedSrcLang? } } }

Providers:
- Google Cloud Translate if GOOGLE_TRANSLATE_API_KEY is set
- Fallback to LibreTranslate (set LIBRE_TRANSLATE_URL, LIBRE_TRANSLATE_API_KEY)
- Last-resort fallback echoes text with via='fallback'

Run:
- cp .env.example .env
- npm i
- npm run dev