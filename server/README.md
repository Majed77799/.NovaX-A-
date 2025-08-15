# Secure Backend

Implements:
- Rate limiting (per IP and per token)
- Request size limits
- JWT admin guard with secret rotation
- Strict CORS allowlist (dev + prod)
- PII-scrubbed logs and audit logging for purchases/admin actions
- Internal crash-report endpoint (no third-party SDKs)

## Setup

1. Copy `.env.example` to `.env` and adjust values.
2. Install deps and run:

```bash
cd server
npm install
npm run dev
```

API:
- `GET /health`
- `POST /purchases` (logs audit event)
- `GET /admin/reports` (requires JWT with `role=admin` claim by default)
- `POST /internal/crash-report` (accepts JSON; stored under `logs/crash-reports/*.jsonl`)

CORS:
- Allowed origins are from `CORS_ALLOWED_ORIGINS`. In prod, include your Vercel domain.

JWT rotation:
- `JWT_SECRETS` is a comma-separated list. First is current signing secret; older ones verify legacy tokens.

## Testing

Generate an admin JWT:
```bash
npm run token:admin
```

Health:
```bash
curl -sS http://localhost:4000/health
```

Admin route (replace $TOKEN):
```bash
curl -sS -H "Authorization: Bearer $TOKEN" http://localhost:4000/admin/reports
```

Purchase example:
```bash
curl -sS -X POST http://localhost:4000/purchases \
  -H 'Content-Type: application/json' \
  -d '{"amount": 1000, "currency": "USD"}'
```

Crash report example:
```bash
curl -sS -X POST http://localhost:4000/internal/crash-report \
  -H 'Content-Type: application/json' \
  -d '{"error":"TypeError", "message":"Something failed", "stack":"..."}'
```

CORS allowlist:
- In development, keep `http://localhost:3000` (Next.js) or `http://localhost:5173` (Vite).
- In production, set your Vercel domain, e.g. `https://yourapp.vercel.app`.