Performance Notes (config-only pass)

Web (Next.js)

- Headers for caching added in `apps/web/next.config.mjs`:
  - `/_next/static` and `/_next/image` set to `public, max-age=31536000, immutable`.
  - Common static file extensions set to long-term caching.
- Experimental `optimizePackageImports` enabled for `react`, `react-dom`, `framer-motion`.
- `reactStrictMode` and `swcMinify` enabled.
- Images: `images.remotePatterns` allows https hosts; refine to specific hosts as needed.

Follow-ups to run locally/CI:

- npm i -w apps/web && npm run build -w apps/web
- Verify headers in local server or deployed env via curl/browser devtools.
- If using external images, restrict `images.remotePatterns` to known hostnames.
- Lighthouse/Axe checks for regression in performance/SEO/accessibility.

Mobile (Expo)

- Hermes enabled via `jsEngine=hermes` in `apps/mobile/app.json`.
- Metro `inlineRequires` enabled in `apps/mobile/metro.config.js`.

Follow-ups to run locally/CI:

- npm i -w apps/mobile
- npx expo-doctor@latest -y
- npx expo prebuild -w apps/mobile --clean
- npx pod-install -w apps/mobile/ios
- Release build smoke test: `npx expo run:ios --configuration Release` / `npx expo run:android --variant release`
- Bundle size check: `npx react-native bundle --platform ios|android` and compare sizes.
