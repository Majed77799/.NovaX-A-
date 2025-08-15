# Privacy-First Analytics & Feature Flags

This repository provides a minimal, self-hostable backend and static frontend that implements:

- `/api/telemetry`: counts-only telemetry (no PII)
- `/api/feature-flags`: feature flags JSON served by backend
- Frontend Settings page with a "Labs" toggle
- Client-side flag caching with TTL (default 5 minutes)

## Run locally

```bash
cd server
npm install
npm start
```

Then open `http://localhost:3000`.

## Environment

- `PORT` (default `3000`)
- `FEATURE_FLAGS_JSON` optional JSON object, e.g.: `{ "labs": true }`
- `EXPOSE_TELEMETRY_STATS=1` to enable `GET /api/telemetry/stats`

## Privacy notes

- Telemetry endpoint only accepts an `event` string and increments an in-memory counter.
- No IP addresses, user identifiers, or request bodies beyond the event name are stored.
- Honors `DNT: 1` header by discarding events.
- Use a reverse proxy if you need IP anonymization at the network layer.

## Frontend flag cache

- Flags are cached in `localStorage` with an expiry timestamp.
- You can refresh flags via the "Refresh Flags" button.
- The Labs toggle creates a local override that affects only the current browser.