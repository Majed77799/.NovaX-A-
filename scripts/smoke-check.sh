#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-}"
if [[ -z "${BASE_URL}" ]]; then
	BASE_URL="${VERCEL_DEPLOYMENT_URL:-}"
fi

if [[ -z "${BASE_URL}" ]]; then
	echo "BASE_URL not provided and VERCEL_DEPLOYMENT_URL not set" >&2
	exit 1
fi

if [[ $# -gt 0 ]]; then
	PATHS=("$@")
else
	PATHS=("/")
fi

function curl_with_retries() {
	local url="$1"
	local max_attempts=30
	local sleep_seconds=5
	local attempt=1
	while (( attempt <= max_attempts )); do
		status=$(curl -s -o /dev/null -w "%{http_code}" -L "$url" || true)
		if [[ "$status" == "200" ]]; then
			return 0
		fi
		echo "Attempt $attempt: $url returned HTTP $status; retrying in ${sleep_seconds}s..."
		sleep "$sleep_seconds"
		((attempt++))
	done
	return 1
}

for p in "${PATHS[@]}"; do
	full_url="${BASE_URL%/}${p}"
	echo "Smoke check: $full_url"
	if curl_with_retries "$full_url"; then
		echo "OK: $full_url"
	else
		echo "FAILED: $full_url" >&2
		exit 1
	fi
done