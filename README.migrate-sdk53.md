Migrate to SDK 53 (light)

This PR performs a light-touch upgrade of the Expo mobile app to SDK 53. No installs or builds have been run. Follow this checklist locally or in CI to complete the migration.

Checklist (to run after pulling this branch):

- Install deps fresh
  - npm i -w apps/mobile
- Validate environment
  - npx expo-doctor@latest -y
  - npx expo install --check -w apps/mobile
- iOS native
  - npx expo prebuild -p ios -w apps/mobile --clean
  - npx pod-install -w apps/mobile/ios
- Android native
  - npx expo prebuild -p android -w apps/mobile --clean
- Verify Hermes and bundling
  - npx expo run:ios -w apps/mobile --configuration Release
  - npx expo run:android -w apps/mobile --variant release
- Test app behavior
  - Launch on iOS/Android devices/emulators
  - Exercise navigation and API calls
- Optional: EAS builds
  - eas build -p ios --profile production
  - eas build -p android --profile production

Notes on changes:

- Set expo ~53.0.0 and react-native 0.76.x in `apps/mobile/package.json`.
- Enabled Hermes and set runtimeVersion to `exposdk:53.0.0` in `apps/mobile/app.json`.
- Keep using `babel-preset-expo`. No code changes required based on current usage.

Troubleshooting:

- If metro issues occur, clear caches: `expo start -c`.
- If iOS build fails, ensure Xcode 16+ and CocoaPods up to date.
- If Android build fails, ensure Java 17 and Android Gradle Plugin per Expo SDK 53 requirements.
