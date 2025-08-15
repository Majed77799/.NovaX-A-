#!/usr/bin/env bash
set -euo pipefail

# Inputs via env vars
VERCEL_TOKEN="${VERCEL_TOKEN:-}"
VERCEL_ORG_ID="${VERCEL_ORG_ID:-}"
VERCEL_PROJECT_ID="${VERCEL_PROJECT_ID:-}"
VERCEL_DEPLOY_PROD="${VERCEL_DEPLOY_PROD:-false}"
API_DIR="${API_DIR:-}"

if [[ -z "$VERCEL_TOKEN" || -z "$VERCEL_ORG_ID" || -z "$VERCEL_PROJECT_ID" ]]; then
	echo "Missing Vercel credentials (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID). Skipping deploy." >&2
	exit 1
fi

if [[ -z "${API_DIR}" ]]; then
	candidates=("apps/api" "api" "server" ".")
	for c in "${candidates[@]}"; do
		if [[ -f "$c/package.json" ]]; then
			API_DIR="$c"
			break
		fi
	done
fi

if [[ -z "${API_DIR}" || ! -d "$API_DIR" ]]; then
	echo "API directory not found. Set API_DIR or create one of: apps/api, api, server, ." >&2
	exit 1
fi

if ! command -v vercel >/dev/null 2>&1; then
	npm i -g vercel@latest >/dev/null 2>&1 || true
fi

pushd "$API_DIR" >/dev/null

# Pull env
if [[ "${VERCEL_DEPLOY_PROD}" == "true" ]]; then
	vercel pull --yes --environment=production --token="$VERCEL_TOKEN" --scope="$VERCEL_ORG_ID" --project="$VERCEL_PROJECT_ID"
else
	vercel pull --yes --environment=preview --token="$VERCEL_TOKEN" --scope="$VERCEL_ORG_ID" --project="$VERCEL_PROJECT_ID"
fi

# Build and deploy
vercel build --token="$VERCEL_TOKEN" --scope="$VERCEL_ORG_ID" --project="$VERCEL_PROJECT_ID"

if [[ "${VERCEL_DEPLOY_PROD}" == "true" ]]; then
	DEPLOY_URL=$(vercel deploy --prebuilt --prod --token="$VERCEL_TOKEN" --scope="$VERCEL_ORG_ID" --project="$VERCEL_PROJECT_ID" | tail -n 1)
else
	DEPLOY_URL=$(vercel deploy --prebuilt --token="$VERCEL_TOKEN" --scope="$VERCEL_ORG_ID" --project="$VERCEL_PROJECT_ID" | tail -n 1)
fi

popd >/dev/null

echo "Deployment URL: $DEPLOY_URL"
export VERCEL_DEPLOYMENT_URL="$DEPLOY_URL"

if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
	echo "deployment_url=$DEPLOY_URL" >> "$GITHUB_OUTPUT"
fi