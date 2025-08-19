# Novax Monorepo

Packages and apps for Novax.

- apps/
  - mobile: Expo SDK 53 (React Native, TS, expo-router)
  - web: Expo Web + PWA
- services/
  - api: Next.js 14 backend (AI proxy, STT/TTS/Image, RAG)
- packages/
  - ui: Shared UI components (Ello-style)
  - core: Shared logic, i18n, hooks, schema
- infra/
  - terraform: Cloud infrastructure as code

## Getting Started

- Install pnpm: https://pnpm.io/installation
- Install deps: `pnpm install`
- Dev all apps: `pnpm dev`
- Start mobile: `pnpm mobile`
- Start web: `pnpm web`
- Start API: `pnpm api`

This repo uses pnpm workspaces and Turborepo.