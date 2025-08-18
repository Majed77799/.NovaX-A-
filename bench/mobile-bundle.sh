#!/usr/bin/env bash
set -euo pipefail

START=$(date +%s%3N)
pushd apps/mobile >/dev/null 2>&1 || true
npx --yes expo export --platform android --dump-assetmap --clear --force  >/dev/null 2>&1 || true
popd >/dev/null 2>&1 || true
END=$(date +%s%3N)
MS=$((END-START))
echo "{ \"target\": \"expo-bundle\", \"bundleMs\": $MS }"
if [ "${BENCH_FAIL_ON_BUDGET:-0}" = "1" ] && [ "$MS" -gt 3500 ]; then
  exit 2
fi