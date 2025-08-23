# Offline-First Messaging Demo

This minimal web app demonstrates:

- Offline detection with a subtle status chip
- Local caching with IndexedDB for messages, templates, and settings
- Outbox queue for unsent messages
- Auto-sync when connection is restored and Background Sync (if supported)
- Service Worker asset caching for offline usage

## Run locally

Use any static file server from the `/workspace/app` directory, for example:

```bash
npx http-server -p 5173 .
```

Then open `http://localhost:5173`.

Note: Sending messages expects a backend at `API Base URL` with `POST /messages`. If not available, requests will fail and messages will remain queued until it becomes available.

## Files

- `index.html` — UI markup
- `styles.css` — styling
- `app.js` — app logic, queueing, sync, and UI updates
- `idb.js` — IndexedDB helper
- `sw.js` — service worker for caching and background sync