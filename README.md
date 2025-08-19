# NovaX (Web + Mobile)

Monorepo with Next.js 14 App Router (`apps/web`) and Expo SDK 53 app (`apps/mobile`), plus shared packages (`packages/*`).

## Install

```bash
pnpm install
```

## Dev

```bash
# Web
pnpm run dev:web
# Mobile (Expo Go)
pnpm run dev:mobile
```

Set environment variables: copy `.env.example` to `.env.local` (for web) or your host.

## Build

```bash
pnpm run build
```

### How to preview in Expo Go (SDK 53)

1. Ensure dependencies are installed: `pnpm install`
2. Align Expo SDK versions: `pnpm --filter @novax/mobile exec npx expo install`
3. Start dev server: `pnpm run dev:mobile`
4. Scan the QR with Expo Go app (iOS/Android). Hermes and inlineRequires are enabled for perf.

### Commands

- Lint: `pnpm run lint`
- Typecheck: `pnpm run typecheck`
- Build web: `pnpm --filter web run build`

## Skia vs SVG orb
- Default: CSS/SVG glow orb for universal parity and 60fps without native modules.
- Mobile: `@shopify/react-native-skia` can be enabled to render a shader glow orb. We use CSS/SVG fallback by default to avoid Expo Go breakage. Enable Skia in a future iteration for production builds.

## Troubleshooting
- 429 errors: configure Upstash env for rate limit or unset to disable.
- SSE not streaming on some hosts: ensure Vercel edge runtime is used and no body buffering middleware.
- Whisper/STT: requires `OPENAI_API_KEY`.
- Supabase RAG: create `documents` table with `embedding vector(1536)` and RPC `match_documents`.
- Stripe: set `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`.

## Next steps
- Add analytics (PostHog or custom) with consent.
- Add i18n auto-translate on the fly.
- Add offline IndexedDB caching for messages/templates.
- Polish animations and orb shader for Skia on mobile builds.