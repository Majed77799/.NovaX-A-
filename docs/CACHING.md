# Caching Policy

## Keys

- feed: `feed:v1`
- pricing: `price:{id}:v1`

## Layers

- HTTP: `Cache-Control: public, s-maxage=60-120, stale-while-revalidate=600`
- Redis: Upstash keys with TTL aligned to s-maxage

## TTLs

- `/api/feed`: 60s
- `/api/pricing/:id`: 120s

## Busting Rules

- Manual bust via deleting keys:
  - `feed:v1`
  - `price:{id}:v1`
- Version suffix `:v1` increments when schema changes
- Automatic expiry via TTL guarantees freshness within budget

## Notes

- Headers allow CDN to cache. Redis adds origin offload and stable latency for p95/p99 targets.