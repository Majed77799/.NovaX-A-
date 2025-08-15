# Project Setup

This repository includes scaffolding to manage environment variables on Vercel and guidelines for performance optimization across web (Next.js) and mobile (Expo).

## Environment Variables
- Copy `.env.example` to `.env.local` (web) and/or `.env` (mobile) for local development.
- On Vercel Dashboard → Project Settings → Environment Variables (Production):
  - `NOVAX_ENABLE_MOCKS` = `0` when real provider keys are present
  - `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY` as needed
  - `NEXT_PUBLIC_API_URL` / `EXPO_PUBLIC_API_URL` for clients

Optional build guard to enforce the above:

```bash
bash scripts/verify-prod-env.sh && <your build command>
```

See `docs/VERCEL_ENV.md` for details.

## Optimization
Guidance lives in `docs/OPTIMIZATION.md` for:
- Reducing bundle size and lazily loading heavy components
- Optimizing images
- Minification and tree-shaking for web and mobile

## Typical Commands (adjust to your stack)
- Web (Next.js):
  - `npm install`
  - `cp .env.example .env.local`
  - `npm run dev` → http://localhost:3000
- Mobile (Expo):
  - `npm install`
  - `cp .env.example .env`
  - `npx expo start --tunnel`

## Production
- Deploy to Vercel. Production URL will be `https://<your-project>.vercel.app`.
- Set provider keys and `NOVAX_ENABLE_MOCKS=0` in Vercel Production env.

## Troubleshooting
- Build fails with env guard: set `NOVAX_ENABLE_MOCKS=0` or remove provider keys.
- 401/403 from AI provider: recheck keys and project billing, rotate keys if needed.
- Large bundles: follow `docs/OPTIMIZATION.md` analyzer steps and lazy-load heavy modules.