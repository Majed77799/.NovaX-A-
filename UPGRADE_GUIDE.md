# Upgrade to Expo SDK 53 and EAS Build

## What changed
- Upgraded `expo` and related packages to SDK 53-compatible versions.
- Updated `apps/mobile/app.json`:
  - `updates.fallbackToCacheTimeout` -> `updates.checkAutomatically: "ON_LOAD"`
  - Added `runtimeVersion: { policy: "appVersion" }`
  - Set `jsEngine: "hermes"`
  - Added `ios.bundleIdentifier` and `android.package` as `com.elloreplica.app`
- Added `apps/mobile/eas.json` with `development`, `preview`, and `production` profiles.
- Added GitHub Actions workflow `.github/workflows/eas-build.yml` to trigger EAS builds on pushes to `main`.
- Added `doctor` script to `apps/mobile/package.json` for `expo doctor --fix`.

## Breaking changes handled
- Expo updates config migration to use `checkAutomatically`.
- Runtime version now set from app version for EAS Updates compatibility.
- Hermes explicitly enabled.
- React 18.3 and RN 0.76 set per Expo compatibility.

## How to run locally
```bash
npm install
npm run dev:mobile
# or in the app folder
cd apps/mobile
npx expo start
```

## EAS Build
- Profiles: `development`, `preview`, `production`
- Remote app versioning enabled (`cli.appVersionSource: remote`)

### Triggering builds locally
```bash
cd apps/mobile
npx eas login  # optional locally
npx eas build --platform ios --profile development
npx eas build --platform android --profile production
```

## CI/CD on GitHub
- On push to `main`, workflow triggers EAS build for both platforms using `production` profile.
- Logs uploaded as artifacts (`eas-build-log`).
- Requires `EXPO_TOKEN` secret.

## Required secrets
- GitHub repository secrets:
  - `EXPO_TOKEN`: Expo access token.
  - Optional (when automating submissions):
    - `EXPO_APPLE_APP_SPECIFIC_PASSWORD` or App Store Connect API key envs
    - Android Keystore envs if using custom credentials

## Code signing
- iOS `bundleIdentifier`: `com.elloreplica.app` (adjust if needed)
- Android `package`: `com.elloreplica.app` (adjust if needed)
- Configure and sync credentials via `npx eas credentials`.

## Web & performance notes
- Hermes enabled.
- Keep images optimized and prefer `@expo/metro-runtime` defaults.
- Use lazy loading and memoization where beneficial.

## Post-upgrade checks
```bash
cd apps/mobile
npx expo doctor --fix
```
Resolve any remaining warnings reported by the tool.