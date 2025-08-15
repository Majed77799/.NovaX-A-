# Unified App Monorepo

This repo contains:
- Web/PWA app (Next.js) at `apps/web`
- Mobile app (Expo) at `apps/mobile`
- API routes served from the web app under `/api/*`

## Prerequisites
- Node.js 18+
- npm 9+

## Install
```bash
npm install
```

## Development
- Web + API (http://localhost:3000):
```bash
npm run dev:web
```
- Mobile (Expo Dev, tunnel):
```bash
npm run dev:mobile
```

## Typecheck and Lint
```bash
npm run typecheck
npm run lint
```

## Build and Start (Web)
```bash
npm run build:web
npm run start -w apps/web
```

## API
- Health: `GET /api/health`
- Chat (SSE stream): `POST /api/chat` with `{ "message": "hi" }`
  - Streams mock deltas by default; enable real providers by adding keys and disabling mocks
- Unsupported endpoints return 501 without crashing:
  - `POST /api/voice`
  - `POST /api/translate`
  - `POST /api/image`

## Environment
Create `apps/web/.env.local`:
```
USE_MOCKS=true
OPENAI_API_KEY=
```

## PWA
- Installable with `apps/web/public/manifest.webmanifest`
- Service worker generated to `apps/web/public/sw.js` on build
- Offline caching enabled for pages/assets

## Production (Vercel)
- Deploy `apps/web`
- Add env vars in Vercel Project Settings → Environment Variables:
  - `USE_MOCKS` (set to `false` to use real providers)
  - `OPENAI_API_KEY` (or your provider key)
- To disable mocks: set `USE_MOCKS=false` and redeploy

## Local URLs
- Web: `http://localhost:3000`
- API: `http://localhost:3000/api`
- Expo tunnel: shown in terminal after `npm run dev:mobile`

## Known limitations
- SSE demo is a minimal mock; real provider integration is stubbed
- Expo not wired to the API; add your own networking as needed