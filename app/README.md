# App

An Expo (mobile + web/PWA) app featuring:

- Streaming chat (mock) with STT (mock via recording) and TTS (expo-speech)
- Templates Store: list, mock purchase (Stripe/Gumroad via browser), download, and My Purchases
- Offline mode indicator and local storage
- Optional push registration (if keys available)
- Admin mini-dashboard with JWT verification
- Jest tests with jest-expo

## Run

- npm start
- npm run web
- npm run android / ios

## Tests

- npm test

## Performance

- Target TTI: <= 1.0s mobile, <= 1.8s web
- Metro minifier configured; avoid console logs in prod

## Notes

- Uses expo-router (tabs)
- Purchases stored in AsyncStorage; downloads saved to FileSystem
- No TODO/FIXME left in codebase