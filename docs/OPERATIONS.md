## Operations

### Environment Variables

Required or optional depending on feature usage.

- AI Providers
  - `OPENAI_API_KEY` (OpenAI chat, TTS, STT, embeddings)
  - `ANTHROPIC_API_KEY` (Anthropic chat)
  - `GOOGLE_API_KEY` (Gemini chat)
  - `STABILITY_API_KEY` (Image generation fallback)

- Supabase (RAG)
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY` (for search)
  - `SUPABASE_SERVICE_ROLE_KEY` (for upsert)

- Web App / CORS
  - `NEXT_PUBLIC_APP_URL` (used by mobile client when calling web APIs)
  - `NOVAX_CORS_ORIGIN` (CORS header for `/api/*`; default `*`) — see `apps/web/next.config.mjs`

- Redis / Rate limiting / Analytics
  - `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`

- Auth (optional JWT gate for `/api/*`)
  - `AUTH_JWT_SECRET`

- Payments (Stripe)
  - `STRIPE_SECRET_KEY`
  - `STRIPE_PRICE_ID`

### Runtime

- All routes declare `export const runtime = 'edge'` and run on the Edge runtime (Streaming supported).
- Body size limit configured in `apps/web/next.config.mjs` via `api.bodyParser.sizeLimit`.

### Queues and Jobs

- No background job runners are present. All operations are request/response.
- Simple counters via Redis are incremented in `apps/web/app/api/analytics/route.ts`.

### Rate Limiting

- Implemented in `apps/web/middleware.ts` via Upstash Ratelimit fixed window 30 req/min per IP.
- Disabled automatically if Redis env vars are not set.

### Health Check

- `GET /api/health` returns `{ ok: true }` with CORS headers. See `apps/web/app/api/health/route.ts`.

### Alerting & Observability

- No integrated alerting providers (PagerDuty/Sentry/Datadog) configured.
- Add Sentry/Datadog/Grafana in future if needed. For now:
  - Use platform logs to monitor API errors.
  - Optionally extend `apps/web/app/api/analytics/route.ts` to push metrics to a real TSDB.

### Dashboards

- None provided. If running on Vercel, use Vercel Analytics/Logs. Otherwise, build simple Redis-based stats endpoints.

### Database (RAG)

- Supabase must define `documents` table with `embedding vector(1536)` and an RPC function `match_documents`.
- The upsert endpoint requires the service role key; restrict access appropriately.

