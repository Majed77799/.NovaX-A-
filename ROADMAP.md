## System Architecture Overview

- Monorepo (Turborepo) with apps and packages:
  - `apps/web` (Next.js 14, edge runtime for APIs) – dashboard, market analysis, content generator, auth, billing
  - `apps/mobile` (Expo SDK 53 + Expo Router) – assistant UI, calls web API
  - `packages/ai` – provider-agnostic streaming chat generation (OpenAI/Anthropic/Gemini)
  - `packages/shared` – shared types, language utils, auth helpers (JWT, password hashing)
  - `packages/api-client` – browser/native-safe API client helpers
  - `packages/integrations` – Stripe webhook helpers, Gumroad verification, Google OAuth helpers

### Feature Integration
- Market Analysis (`/market` → `/api/market/insights`):
  - Uses `@repo/ai.generateStreaming` to produce insights; persists latest per-user insights to Upstash Redis when JWT is present
  - Dashboard aggregates recent insights for the logged-in user via `/api/dashboard/insights`
- AI Content Generator (`/content` → `/api/content/generate`):
  - Generates multi-channel JSON content blocks; persists per-user to Redis
  - Dashboard displays recent content items
- Dashboard (`/dashboard` → `/api/dashboard/insights`):
  - Combines basic analytics counters + per-user latest market/content items
  - Links to Market and Content tools

### API Layer
- Next.js App Router API routes under `apps/web/app/api`:
  - `chat`, `stt`, `tts`, `image`, `rag/*` (existing)
  - `market/insights` – market analysis
  - `content/generate` – content generation
  - `dashboard/insights` – aggregation for dashboard
  - `analytics` – event counters
  - `auth/login` – demo email/password to JWT
  - `auth/google` and `auth/google/callback` – social login via Google OAuth
  - `stripe/checkout` – creates checkout session with user metadata
  - `stripe/webhook` – marks user premium on successful payment
  - `billing/status` – returns premium flag for current user

- Middleware (`apps/web/middleware.ts`):
  - JWT-gates API routes by default, allowlists public ones (auth, health, chat, tts, stt, image, analytics, stripe webhook)

### Authentication
- JWT tokens issued from `auth/login` (demo) or Google OAuth callback
- Token stored in `localStorage` on web/mobile; sent as `Authorization: Bearer <token>`
- Shared helpers in `@repo/shared/src/auth`

### Payments
- Stripe Checkout (uses `STRIPE_PRICE_ID`), attaches `userId` metadata
- Stripe Webhook validates signature (`STRIPE_WEBHOOK_SECRET`) and sets `user:{userId}:premium` in Upstash Redis
- Optional: Gumroad license verification endpoint available via `@repo/integrations.verifyGumroadLicense`

### UI/UX
- Urbanist font (web via `next/font`, mobile via `expo-font`)
- Pastel gradients and floating orb assistant included
- Pages: `/login`, `/dashboard`, `/market`, `/content`

### Mobile (Expo SDK 53)
- Upgraded to Expo SDK 53, React Native 0.76
- Expo Router structure in `apps/mobile/app`
- Uses `EXPO_PUBLIC_API_URL` to call web API when deployed

### CI/CD
- GitHub Actions: typecheck/build; deploy to Vercel on main; trigger EAS builds for mobile
- Web deployment uses `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- Mobile build uses `EXPO_TOKEN`

### Environment Variables (.env example)

Create `.env` at project root (and set in Vercel/Expo secrets):

```
# App
NEXT_PUBLIC_APP_URL=https://your-web-app.vercel.app
NOVAX_CORS_ORIGIN=*

# Auth
AUTH_JWT_SECRET=replace_with_long_random_secret
AUTH_PASSWORD_SALT=replace_with_salt
DEMO_USER_EMAIL=demo@example.com
DEMO_USER_PASSWORD=password
# Optional: hash instead of plaintext
# DEMO_USER_PASSWORD_HASH=...

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=https://your-web-app.vercel.app/api/auth/google/callback

# Providers
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_API_KEY=

# Upstash Redis
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Mobile
EXPO_PUBLIC_API_URL=https://your-web-app.vercel.app
```

### Adding New AI Tools
1. Create API route under `apps/web/app/api/<tool>/route.ts` using `@repo/ai.generateStreaming`
2. Persist per-user outputs to Redis with key `user:{userId}:<tool>`
3. Expose summary on `/api/dashboard/insights`
4. Add page under `apps/web/app/<tool>/page.tsx` and a client helper in `@repo/api-client`
5. If needed on mobile, add a screen in `apps/mobile/app/<tool>.tsx`

### Testing
- Type checking: `npm run typecheck`
- Build (turbo): `npm run build`
- Manual tests:
  - Login with demo credentials, run Market and Content flows
  - Verify `/dashboard` shows results
  - Stripe: run test checkout, confirm webhook sets premium

### Architecture Summary
- Next.js serves as the unified backend/API and web frontend
- Expo mobile consumes the same API
- Central AI layer orchestrates providers
- Redis acts as a lightweight persistence/cache for user artifacts and flags
- Payments toggle premium features via Stripe; social login via Google