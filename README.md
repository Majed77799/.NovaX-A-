Environment setup

1. Copy `.env.example` to `.env` and fill in real values.
2. Do not commit `.env` (already ignored by `.gitignore`).
3. To load variables into your current shell (bash):

```
set -a; source .env; set +a
```

Notes
- `NOVAX_DEFAULT_PROVIDER` can be `openai`, `anthropic`, or `google` depending on your setup.
- Keep `SUPABASE_SERVICE_ROLE` private; never expose it client-side.