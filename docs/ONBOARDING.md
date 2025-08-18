## Onboarding

### Prerequisites
- Node.js 18+ and npm 10+
- For mobile: Expo CLI (`npx expo` will be installed automatically by scripts)

### Clone & Install

```bash
git clone <your-fork-url>
cd <repo>
npm install
```

### Environment Setup

Create env files and set keys as needed:

- Web (Next.js): create `apps/web/.env.local`
- Common keys used across features:
  - `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`, `STABILITY_API_KEY`
  - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  - `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
  - `NOVAX_CORS_ORIGIN` (optional), `AUTH_JWT_SECRET` (optional)
  - `NEXT_PUBLIC_APP_URL` (set this to your web URL for the mobile app to call, e.g. `http://localhost:3000`)

Example minimal `apps/web/.env.local` for local dev:

```env
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
NOVAX_CORS_ORIGIN=*
AUTH_JWT_SECRET=dev-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Run (Dev)

From repo root:

```bash
# run both apps in parallel
npm run dev

# or individually
npm run dev:web
npm run dev:mobile
```

- Web dev server: `http://localhost:3000`
- Mobile: scan the QR printed by `expo start` with Expo Go (simulators also supported)

### Seeding (RAG)

Insert documents into Supabase and upsert embeddings via the API.

```bash
# Upsert a doc (replace values)
curl -X POST http://localhost:3000/api/rag/upsert \
  -H 'Content-Type: application/json' \
  -d '{"id":"doc_1","text":"Hello world","metadata":{"topic":"demo"}}'

# Query
curl -X POST http://localhost:3000/api/rag/search \
  -H 'Content-Type: application/json' \
  -d '{"query":"world","topK":5}'
```

### Testing

No automated tests are present yet. Manual checks:
- Chat: POST `http://localhost:3000/api/chat` with body `{ messages: [{ role:"user", content:"Hello" }] }` and verify streamed response in the web UI.
- STT: POST a `file` to `/api/stt` (e.g., via a simple HTML form or REST client).
- TTS: POST `{ text:"Hello" }` to `/api/tts` and verify audio.
- Image: POST `{ prompt:"a cat" }` to `/api/image`.
- Stripe checkout: POST to `/api/stripe/checkout` with `STRIPE_SECRET_KEY` and `STRIPE_PRICE_ID` set.

### Useful Paths
- Web UI: `apps/web/app/page.tsx`
- API routes: `apps/web/app/api/*`
- Edge middleware: `apps/web/middleware.ts`
- AI orchestration: `packages/ai/src/index.ts`
- API client helpers: `packages/api-client/src/index.ts`
- Shared utils/types: `packages/shared/src/index.ts`

