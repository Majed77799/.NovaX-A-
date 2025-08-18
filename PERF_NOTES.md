### Performance notes

Web (Next.js):
- Run with analyzer: `ANALYZE=true npm run dev:web`
- Toggle Next Image: `NEXT_IMAGE_UNOPTIMIZED=true` to disable image optimizer when not available
- Route-level code splitting: see `apps/web/app/settings/page.tsx` and `apps/web/app/(components)/HeavyCharts.tsx`
- SWC minify and modularizeImports enabled in `apps/web/next.config.mjs`

Mobile (Expo):
- Hermes is default on SDK 51; inline requires via Babel env plugin
- Optional fast storage behind `MMKV_ENABLED=true`; see `apps/mobile/src/App.tsx`
- Keep SDK/tooling up to date for perf wins

Repo/Turbo:
- Dev tasks are uncached; build cache carries `.next`, `dist`, `build`
- Remote cache signature env supported via `TURBO_REMOTE_CACHE_SIGNATURE`

