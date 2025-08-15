# AI Content Generator

This module adds an AI-powered content creation tool to the Expo mobile app with OpenAI (and fallbacks) via the web API.

## Features
- Modes: Product description, Instagram, TikTok, Twitter, Facebook Ads, Google Ads, Email template
- Tabs UI, Urbanist font, pastel gradient background
- Uses trend-based keywords via `@repo/market-analysis`
- Save locally, export `.txt` and PDF, copy-to-clipboard
- One‑click optimize using target audience

## Architecture
- API: `apps/web/app/api/generate/route.ts` streams content using `@repo/ai` and `buildPrompt`
- Prompt util: `apps/web/app/api/generate/prompt.ts`
- Trends: `packages/market-analysis/src/index.ts`
- Mobile UI: `apps/mobile/src/modules/ContentGenerator/index.tsx`

## Setup
1. Env vars (one or more):
   - `OPENAI_API_KEY` (recommended)
   - `ANTHROPIC_API_KEY` or `GOOGLE_API_KEY` (optional fallbacks)
2. Install deps at repo root:
   - `npm install`
3. Run web and mobile:
   - `npm run dev:web` (Next.js API for generation)
   - `npm run dev:mobile` (Expo)
   - Ensure `NEXT_PUBLIC_APP_URL` is set on mobile process to your web URL. Example: `NEXT_PUBLIC_APP_URL=http://localhost:3000 npm run dev:mobile`

## Usage
- In mobile app top tabs, switch to Generator.
- Enter keywords/product, select mode, optional target audience and category, enable trends.
- Generate. Then optionally use "One‑click optimize".
- Export, save, or copy the output.

## Templates & Styling
- Urbanist font loaded in both App and ContentGenerator
- Pastel gradient: `#F6E7FF → #E9F0FF → #D7F7FF`

## Tests
- Prompt builder tests: `apps/web/__tests__/prompt.test.ts`
- Market trends tests: `packages/market-analysis/src/index.test.ts`

## Notes
- PDF generation is a simple text-only base64 PDF for portability. For production, consider `react-native-print` or a full PDF lib.
- Trend keywords are mock-based placeholders; integrate with a real trends source as needed.