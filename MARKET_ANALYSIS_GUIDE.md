### Market Analysis Feature Guide

This module adds market research for trending digital products, pricing insights, opportunity scoring, and AI-backed recommendations.

#### Architecture
- Backend: `apps/web/app/api/market/route.ts`
  - Aggregates data from Google Trends (+ optional Etsy/Gumroad)
  - Runs core analysis in `@repo/market-analysis`
  - Optionally invokes LLM via `@repo/ai` for recommendations
- Shared logic: `packages/market-analysis`
  - Providers: `providers/trends.ts`, `providers/etsy.ts`, `providers/gumroad.ts`
  - Analysis: `analyze.ts`
  - Types: `types.ts`
- Mobile UI: `apps/mobile/src/MarketAnalysis/index.tsx`
  - Run analysis, show charts (lists), export PDF, local caching via AsyncStorage
  - Open via Quick Chip “Market” in the main assistant screen

#### APIs and Keys
- Required for live trends: add `google-trends-api` (already installed in web app)
- Optional data enrichments:
  - `ETSY_API_KEY` — Etsy Listings API (v3)
  - `GUMROAD_ACCESS_TOKEN`, `GUMROAD_SELLER_ID`
- Optional LLM for recs: `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` or `GOOGLE_API_KEY`

#### Request
POST `/api/market`
Body: `{ "keywords": string[], "geo": string }`
Response: `MarketAnalysisResult` with:
- `topCategories`: demand scores (0-100)
- `suggestedPriceRanges`: per-category price range
- `marketOpportunityScore`: 0-100
- `recommendations`: string[]

#### Offline and Rate Limits
- If Google Trends fails or dependency missing, API returns 503 with `{ code: 'TRENDS_UNAVAILABLE' }`.
- Etsy/Gumroad are optional and silently skipped if keys missing.
- LLM recommendations fall back to deterministic text if no model keys.
- Mobile caches last successful result as `market:last` in AsyncStorage.

#### Export PDF
- Mobile uses `expo-print` to render HTML-to-PDF and `expo-sharing` to share.

#### Testing
- Unit tests: `packages/market-analysis/tests/analyze.test.ts` (Vitest)
- Run all tests:
```bash
npm run build --workspaces
npx vitest run --dir packages/market-analysis
```

#### Local Setup
1. `npm install`
2. (Optional) set env vars in `apps/web/.env.local`:
```
OPENAI_API_KEY=...
GOOGLE_API_KEY=...
ETSY_API_KEY=...
GUMROAD_ACCESS_TOKEN=...
GUMROAD_SELLER_ID=...
```
3. Start web: `npm run dev:web`
4. Start mobile: `npm run dev:mobile`
5. In the mobile app, tap “Market”, edit keywords, and run analysis.

#### Integrating with Assistant Flow
- The assistant UI in `App.tsx` now includes a “Market” quick chip to open the module.
- You can also have the assistant call `/api/market` server-side or propose to run market analysis when the user asks.