# Migrate to Expo SDK 53 (NovaX)

- Ensure `expo` is `~53.x` and React Native `0.75.x` in `apps/mobile/package.json`.
- Run:

```bash
pnpm --filter @novax/mobile exec npx expo install
```

- Confirm `runtimeVersion: { policy: "sdkVersion" }` in `app.json` and `eas.json` build profiles.
- Metro: `inlineRequires` enabled; Hermes is on by default in Expo SDK 53.
- Preview via EAS Update:

```bash
cd apps/mobile
npx eas update --branch preview --message "NovaX mobile preview" --non-interactive
```

Expo Go will open the update URL it prints. Ensure `EXPO_TOKEN` is set in CI/Secrets.