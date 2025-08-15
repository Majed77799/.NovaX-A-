## Vercel Environment Setup

Use the Vercel Dashboard to manage production environment variables.

- Project Settings → Environment Variables
- Create the following variables for the Production environment:
  - `NOVAX_ENABLE_MOCKS` = `0` (when real API keys are set)
  - `OPENAI_API_KEY` = `...`
  - `ANTHROPIC_API_KEY` = `...`
  - `GOOGLE_API_KEY` = `...`
  - Any public URLs your client needs (e.g. `NEXT_PUBLIC_API_URL`, `EXPO_PUBLIC_API_URL`)

### Enforcing NOVAX_ENABLE_MOCKS=0
If any provider key is present, the build must not proceed with mocks enabled. You can add a lightweight guard in your build:

- Build Command (example):
  - `bash scripts/verify-prod-env.sh && <your build command>`

This will fail the build if keys are set but `NOVAX_ENABLE_MOCKS` is not `0`.

### Local Development
- Copy `.env.example` to `.env.local` (Next.js) and/or `.env` (Expo) and fill in variables as needed.
- Keep `NOVAX_ENABLE_MOCKS=1` locally if you do not have provider keys.