# Ello Perfect Replica (Web + Mobile)

Monorepo with Next.js 14 PWA (`apps/web`) and Expo Go app (`apps/mobile`), plus shared packages for AI orchestration and utilities.

## Install

```bash
npm install
```

## Dev

```bash
# Web
npm run dev:web
# Mobile (Expo Go)
npm run dev:mobile
```

Set environment variables: copy `.env.example` to `.env.local` (for web) or your host.

## Build

```bash
npm run build
```

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

## Performance
- Web bundle analyzer: `ANALYZE=true npm run dev:web`
- Toggle Next Image optimization: set `NEXT_IMAGE_UNOPTIMIZED=true` for environments without sharp/libvips
- Expo Metro: inline requires via Babel; optional MMKV cache behind `MMKV_ENABLED=true`