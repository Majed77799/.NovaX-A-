# Ello Replica Web

## Run

- copy `.env.example` to `.env.local` and fill keys
- install at repo root: `npm install`
- dev: `npm run dev:web`

### Analyze bundle

Set `ANALYZE=true` to visualize client and server bundles with `@next/bundle-analyzer`:

```
ANALYZE=true npm run dev:web
```

## Build

- `npm run build`

## API routes
- `/api/chat` streaming chat
- `/api/stt` speech-to-text
- `/api/tts` text-to-speech
- `/api/image` image generation
- `/api/rag/*` vector search & upsert