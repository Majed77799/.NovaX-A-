## Features Matrix

| Feature | Status | Key Files | Tests |
|---|---|---|---|
| Chat (SSE streaming) | Stable | `apps/web/app/api/chat/route.ts`, `packages/ai/src/index.ts`, `apps/web/app/page.tsx`, `packages/api-client/src/index.ts` | n/a (no tests in repo) |
| Speech-to-Text (Whisper) | Stable | `apps/web/app/api/stt/route.ts` | n/a |
| Text-to-Speech (OpenAI) | Stable | `apps/web/app/api/tts/route.ts` | n/a |
| Image Generation (OpenAI/Stability) | Stable | `apps/web/app/api/image/route.ts` | n/a |
| RAG Search | Stable | `apps/web/app/api/rag/search/route.ts` | n/a |
| RAG Upsert | Stable | `apps/web/app/api/rag/upsert/route.ts` | n/a |
| Rate Limiting (Upstash) | Stable | `apps/web/middleware.ts` | n/a |
| JWT Auth Gate for `/api/*` | Stable | `apps/web/middleware.ts` | n/a |
| Analytics Counter (Redis) | Stable | `apps/web/app/api/analytics/route.ts` | n/a |
| PWA (Service Worker) | Stable | `apps/web/next.config.mjs`, `apps/web/public/workbox-*.js` | n/a |
| Mobile client (Expo) | Stable | `apps/mobile/src/App.tsx` | n/a |
| Health endpoint | Stable | `apps/web/app/api/health/route.ts` | n/a |
| Stripe Checkout | Stable | `apps/web/app/api/stripe/checkout/route.ts` | n/a |

Notes:
- No automated test files were found (Jest/vitest/pytest). Add tests in future iterations.

