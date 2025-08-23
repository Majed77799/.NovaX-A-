## System Architecture

Ello Replica is a monorepo with a Next.js 14 PWA, an Expo mobile app, and shared packages for AI orchestration and client utilities. All server endpoints run on the Next.js Edge runtime.

### Components
- Web app: `apps/web` (Next.js 14 + PWA via `next-pwa`)
- Mobile app: `apps/mobile` (Expo Go)
- Shared AI orchestration: `packages/ai` (multi‑provider streaming)
- Shared API client helpers: `packages/api-client`
- Shared types/utilities: `packages/shared`

### High-level Diagram

```
             +-------------------+               +-------------------+
             |   apps/mobile     |               |     apps/web      |
             |  (Expo RN client) |               |  (Next.js PWA)    |
             +---------+---------+               +----------+--------+
                       |                                     |
                       | HTTPS (fetch)                       | HTTPS (fetch)
                       v                                     v
                 /api/* routes on Next.js Edge runtime (apps/web)
                       |   (SSE for chat, JSON for others)
                       |
                       v
        +-------------------------------+   uses   +----------------------+
        |   packages/ai (orchestration) |<---------| env provider keys    |
        |  - OpenAI / Anthropic /      |          | (OPENAI/ANTHROPIC/   |
        |    Google Gemini streaming    |          |  GOOGLE_API_KEY)     |
        +-------------------------------+          +----------------------+
                       |
                       | Embeddings (OpenAI)
                       v
            +---------------------------+
            |   Supabase (Vector RAG)  |
            |  tables: documents       |
            |  RPC: match_documents    |
            +---------------------------+
                       ^
                       | optional rate/analytics
                       v
            +---------------------------+
            |  Upstash Redis (rate     |
            |  limit + simple metrics) |
            +---------------------------+
```

### Data Flow
- Chat (SSE):
  - Client (`apps/web/app/page.tsx` or `apps/mobile/src/App.tsx`) calls `POST /api/chat`.
  - Route handler: `apps/web/app/api/chat/route.ts` sets SSE headers using `packages/shared` and streams tokens.
  - `packages/ai` selects a provider based on available keys (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`) and streams tokens via SDK APIs.
  - Client accumulates streamed chunks into the assistant message.

- Speech to Text (STT):
  - Client uploads a `file` to `POST /api/stt`.
  - `apps/web/app/api/stt/route.ts` calls OpenAI Whisper (`OPENAI_API_KEY`) and returns JSON `{ text }`.

- Text to Speech (TTS):
  - Client posts `{ text, voice }` to `POST /api/tts`.
  - `apps/web/app/api/tts/route.ts` calls OpenAI TTS (`gpt-4o-mini-tts`) and returns `audio/mpeg`.

- Image Generation:
  - Client posts `{ prompt }` to `POST /api/image`.
  - `apps/web/app/api/image/route.ts` uses OpenAI Images if `OPENAI_API_KEY` else Stability if `STABILITY_API_KEY`, else returns a tiny mock PNG.

- RAG (Search/Upsert):
  - Search: `POST /api/rag/search` calls Supabase RPC `match_documents` using `SUPABASE_URL` + `SUPABASE_ANON_KEY`.
  - Upsert: `POST /api/rag/upsert` embeds via OpenAI (`text-embedding-3-small`), then `upsert` into `documents` using `SUPABASE_SERVICE_ROLE_KEY`.

- Analytics + Rate Limiting:
  - Analytics: `POST /api/analytics` increments `analytics:*` keys in Upstash Redis if configured.
  - Rate limiting + JWT gate for `/api/*`: `apps/web/middleware.ts` leverages Upstash Redis and optional `AUTH_JWT_SECRET`.

### Key Files
- Web UI: `apps/web/app/page.tsx`, styles `apps/web/app/globals.css`
- API Routes: `apps/web/app/api/*`
- Middleware: `apps/web/middleware.ts`
- PWA config: `apps/web/next.config.mjs`, service worker in `apps/web/public/*`
- AI Orchestration: `packages/ai/src/index.ts`
- Shared utils/types: `packages/shared/src/index.ts`
- API Client helpers: `packages/api-client/src/index.ts`

