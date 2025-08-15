## Optimization Guide (Web and Mobile)

### Reduce Bundle Size & Lazy Load Heavy Components
- Prefer dynamic imports and code-splitting.
- Extract rarely used UI into separate chunks loaded on demand.

Next.js example (web):

```ts
// example: app/components/Charts.tsx is heavy
import dynamic from 'next/dynamic'

const Charts = dynamic(() => import('../components/Charts'), {
  ssr: false,
  loading: () => <div>Loading charts…</div>,
})

export default function Page() {
  return <Charts />
}
```

React/Expo example (mobile):

```tsx
import React, { Suspense, lazy } from 'react'

const HeavyWidget = lazy(() => import('./HeavyWidget'))

export function Screen() {
  return (
    <Suspense fallback={null}>
      <HeavyWidget />
    </Suspense>
  )
}
```

### Optimize Image Assets
- Prefer vector/SVG where possible, or modern formats (WebP/AVIF).
- For web, use Next.js `next/image` with appropriate sizes and `sizes` attribute.
- For Expo, use `expo-image` and provide multiple resolutions.

Next.js example:

```tsx
import Image from 'next/image'

export function Hero() {
  return (
    <Image
      src="/images/hero.webp"
      alt="Hero"
      width={1600}
      height={900}
      priority
      sizes="(max-width: 768px) 100vw, 1600px"
    />
  )
}
```

Expo example:

```tsx
import { Image } from 'expo-image'

export function Avatar() {
  return (
    <Image
      source={{ uri: 'https://example.com/avatar@2x.webp' }}
      contentFit="cover"
      cachePolicy="memory-disk"
      style={{ width: 96, height: 96, borderRadius: 48 }}
    />
  )
}
```

### Minify & Tree-shake Code
- Web (Next.js): Default SWC minification is enabled in production builds. Ensure `process.env.NODE_ENV === 'production'` when building. Avoid importing entire libraries; import subpath/ESM builds.
- Mobile (Expo): Production build uses Metro minifier and Hermes. Ensure ESM-friendly imports and avoid deep re-exports that block treeshaking.

General tips:
- Import from submodules (e.g., `lodash-es/pick` instead of `lodash`).
- Prefer ESM over CJS packages when available.
- Mark unused files as not imported; remove dead code and `sideEffects: false` only if safe.
- Use `babel-plugin-transform-remove-console` in production if desired.

### Analyze Bundles
- Web: use `next build` with analyzer plugins (`@next/bundle-analyzer`).
- Mobile: run `EXPO_PROFILE=production npx expo run:android|ios` and inspect bundle size reports.