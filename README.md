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

## Mobile app (Expo + EAS) — Production build & publish

- Prereqs:
  - Create an Expo account and set `EXPO_TOKEN` as an org/repo secret in CI, or run `eas login` locally.
  - For iOS, enroll in Apple Developer Program and have an App Store Connect account.

### Android
- Local artifacts already built:
  - AAB: `apps/mobile/android/app/build/outputs/bundle/release/app-release.aab`
  - APK: `apps/mobile/android/app/build/outputs/apk/release/app-release.apk`
- Sign and upload:
  - If you need Play App Signing, you can upload the AAB as-is to Google Play Console.
  - Create app in Play Console with package `com.novax.ello`.

### iOS (EAS cloud)
- Build IPA in cloud:
```bash
cd apps/mobile
export EXPO_TOKEN=your_expo_token
# Set up credentials automatically (recommended)
eas build:configure --platform ios --non-interactive
eas build --platform ios --profile production --non-interactive
```
- After build completes, download the `.ipa` from the EAS build details page, then upload via Transporter or `eas submit`:
```bash
# Submit to App Store Connect (automated)
eas submit -p ios --profile production --non-interactive
```

### OTA updates (EAS Update)
- Channels: `preview`, `production`
```bash
cd apps/mobile
export EXPO_TOKEN=your_expo_token
eas update --channel preview --non-interactive --auto
# after release tag or when ready for production
eas update --channel production --non-interactive --auto
```

### Env configuration
- API base URL configured via `app.json > expo.extra.apiUrl`.
  - Override at build time: `EXPO_PUBLIC_API_URL` or edit `app.json`.

### Compliance
- iOS `ITSAppUsesNonExemptEncryption=false` configured.
- Android permissions restricted to `INTERNET` only.
- Hermes enabled for both platforms; R8/Proguard/shrinkResources enabled for smaller bundles.

### CI/CD
- Workflow at `.github/workflows/eas.yml`:
  - On push to main: EAS Update to `preview`.
  - On tag: Builds Android AAB and iOS IPA in EAS, then uploads as workflow artifacts.
  - Requires `EXPO_TOKEN` secret in the repository.