# NovaX Monorepo

Apps:
- apps/web (Next.js 14 App Router)
- apps/mobile (Expo React Native)
- apps/workers (Node Workers / BullMQ)

Packages:
- packages/shared (utils, i18n helpers, observability)
- packages/ai (provider-agnostic AI streaming)
- packages/api-client (browser/client API bindings)
- packages/db (Mongoose models & connection)

## Environment

Required env vars (web):
- OPENAI_API_KEY, ANTHROPIC_API_KEY, GOOGLE_API_KEY (optional)
- SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY (RAG)
- UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN (rate limit + caching)
- AUTH_JWT_SECRET (optional for API auth)
- STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_ID (Stripe)
- NEXT_PUBLIC_APP_URL (for mobile to call web)
- NOVAX_CORS_ORIGIN (CORS)
- MONGODB_URI, MONGODB_DB

Required env vars (workers):
- REDIS_URL or UPSTASH_REDIS_REST_URL
- MONGODB_URI, MONGODB_DB
- OPENAI_API_KEY (for marketing/translations)

## Development

- npm run dev (runs all apps)
- npm run dev:web, npm run dev:mobile

## Deployment

- Web: Vercel
  - Set env vars above in Vercel project
  - Add `STRIPE_WEBHOOK_SECRET` and configure webhook to `/api/stripe/webhook`
  - Ensure Edge runtime for most APIs; webhook runs on Node runtime

- Workers: any Node host (Fly, Render, AWS ECS)
  - Build `apps/workers` and run `node dist/index.js`
  - Provide Redis and Mongo env vars

- Redis: Upstash
- MongoDB: Atlas
- Storage: S3-compatible (configure in workers if needed)

## Observability

- Console JSON logs via `@repo/shared` log/metric helpers
- Health endpoint: `/api/health`

## QA Notes

- Feed, pricing, bundles, social, guilds, quests, watermark, insights, translations endpoints implemented
- Stripe checkout creates `Order` and webhook handles Connect transfers based on product splits
- Caching with Upstash Redis for feed, pricing, bundles
- i18n: Accept-Language used in feed; Next.js i18n config set
- Security: Middleware with JWT (if AUTH_JWT_SECRET set) and rate limiting