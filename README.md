# PWA Web Push Demo

This demo adds Web Push Notifications to a simple PWA with a toggle UI, a backend using VAPID keys, and a service worker.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   - Copy `.env.example` to `.env`
   - Generate keys:
     ```bash
     npx web-push generate-vapid-keys
     ```
   - Set `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` in `.env`.
3. Run in dev:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in a browser with notifications enabled.

## Behavior when keys are missing
- If VAPID keys are not present, the `/api/push/public-key` returns `enabled: false` and the UI toggle is hidden gracefully.

## Test notification
- Click "Send test" to send a server-initiated notification to all current subscriptions.