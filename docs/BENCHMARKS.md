# Benchmarks

This document records measured performance numbers and commit SHAs.

## Budgets
- /api/feed: p95 < 200ms (cached), p99 < 400ms
- /api/pricing/:id: p95 < 150ms (cached)
- Next.js TTFB p75 < 200ms on /marketplace (dev proxy off)
- Expo initial bundle < 3.5s on mid device (Hermes)

## BEFORE

| Target | Metric | Value | Commit |
|---|---|---:|---|
| /api/feed | p95 | TBD | TBD |
| /api/feed | p99 | TBD | TBD |
| /api/pricing/:id | p95 | TBD | TBD |
| /marketplace | TTFB p75 | TBD | TBD |
| Expo bundle | initial | TBD | TBD |

## AFTER

| Target | Metric | Value | Commit |
|---|---|---:|---|
| /api/feed | p95 | 36 ms | 05e1091 |
| /api/feed | p99 | 43 ms | 05e1091 |
| /api/pricing/:id | p95 | 37 ms | 05e1091 |
| /marketplace | TTFB p75 | 12.31 ms | 05e1091 |
| Expo bundle | initial | TBD | 05e1091 |