# Ello Replica Monorepo

- apps/web — Next.js web app (APIs)
- apps/mobile — Expo app
- packages/* — shared packages

## Dev

- `npm run dev` — run both apps
- `npm run dev:web` — web only
- `npm run dev:mobile` — mobile only

## Market Analysis (new)

- API: `POST /api/market` with `{ keywords?: string[], geo?: string }`
- Mobile: Open the app and tap the "Market" quick chip to launch the Market Analysis screen. Enter keywords and run analysis. Export PDF from the screen.
- Env (optional for richer data): set `OPENAI_API_KEY`, `ETSY_API_KEY`, `GUMROAD_ACCESS_TOKEN`, `GUMROAD_SELLER_ID`, `GOOGLE_API_KEY`.

Testing locally:
1. Install deps at repo root: `npm install`
2. Start web: `npm run dev:web` (defaults to `http://localhost:3000`)
3. In another terminal: `npm run dev:mobile`
4. In the mobile app, tap "Market" and run analysis. If no keys, you'll still see trends-based results; AI recommendations will use fallback text if no model keys.