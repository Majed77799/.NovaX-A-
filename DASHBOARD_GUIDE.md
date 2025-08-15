### Advanced Dashboard Guide

This guide explains the Dashboard feature for the Expo mobile app in `apps/mobile`.

#### Overview
- New screen: `src/screens/Dashboard.tsx`
- Analytics storage: `src/lib/analytics.ts` (AsyncStorage-based with optional sync to web API)
- Charts: `victory-native` with `react-native-svg`
- Sticky header: quick actions (Create Product, Export, Market Analysis)
- Filters: date range, product type, sales channel
- Offline-first: caches analytics locally and syncs to backend when online
- Tests: `src/screens/__tests__/Dashboard.test.tsx`

#### Dependencies
Added in `apps/mobile/package.json`:
- `victory-native`, `react-native-svg`
- `@react-native-async-storage/async-storage`
- `expo-network`, `expo-sqlite` (optional; current storage uses AsyncStorage)
- Testing: `jest`, `jest-expo`, `@testing-library/react-native`, `@testing-library/jest-native`

#### UI/Theme
- Uses Urbanist font from `src/assets/Urbanist-VariableFont_wght.ttf`
- Pastel gradient background: `#F6E7FF -> #E9F0FF -> #D7F7FF` for theme alignment

#### Navigation
- A simple tab switcher was added to `src/App.tsx` to toggle between Chat and Dashboard. Replace with your navigator if needed.

#### Analytics Data Model
- Events stored in AsyncStorage under key `analytics_events_v1`
- Event types: `product_created`, `exported`, `ai_user`, `ai_assistant`, `sale_stripe`, `sale_gumroad`
- Helpers:
  - `recordEvent(...)`
  - `getSummary(filters)`
  - `getTimeSeries(kind, filters, bucket)`
  - `syncPendingEvents(baseUrl)` posts to web `POST /api/analytics`

#### Sales Integration
- If your web app has Stripe/Gumroad data, emit `sale_stripe`/`sale_gumroad` events with `amount` and `salesChannel`. Example:
```ts
await recordEvent({ type: 'sale_stripe', amount: 49, salesChannel: 'stripe' });
```
- The backend in `apps/web` exposes `POST /api/analytics`, which increments counters when configured with Upstash Redis; otherwise logs to console.

#### Filters
- Date range: 7d, 30d, 90d, All
- Product type: all, digital, service, template, other
- Sales channel: all, stripe, gumroad, other

#### Performance
- Data aggregations memoized by filters and range
- Charts render only after data fetched
- Lightweight views with minimal overdraw and batched state updates

#### Running Locally
1. Install dependencies at repo root:
```bash
npm i
```
2. Start the web backend (optional but recommended for analytics sync):
```bash
npm run dev:web
```
3. In another terminal, start the mobile app:
```bash
npm run dev:mobile
```
4. In Expo Go or emulator, open the app. Use the top tabs to switch to Dashboard.

Environment variable for mobile to reach web API:
- `NEXT_PUBLIC_APP_URL` (e.g., `http://localhost:3000` or your LAN IP). Configure in your Expo app env if needed.

#### Testing
From `apps/mobile`:
```bash
npm test
```

#### Files Changed
- `apps/mobile/src/App.tsx`: added Dashboard tab and event hooks
- `apps/mobile/src/screens/Dashboard.tsx`: new dashboard screen
- `apps/mobile/src/lib/analytics.ts`: analytics storage and sync
- `apps/mobile/package.json`: dependencies and test scripts
- `apps/mobile/jest.config.js`, `apps/mobile/jest.setup.ts`: testing setup
- `apps/mobile/src/screens/__tests__/Dashboard.test.tsx`: tests

#### Extending
- Replace the simple tab with React Navigation or Expo Router
- Swap AsyncStorage with `expo-sqlite` for larger datasets
- Populate Sales by Channel pie with real data by aggregating events
- Add more charts (retention, conversion) and server-driven metrics