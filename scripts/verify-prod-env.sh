#!/usr/bin/env bash
set -euo pipefail

# This guard is intended for CI/Prod builds.
# If any provider key is present, NOVAX_ENABLE_MOCKS must be 0.

has_keys=0
for var_name in OPENAI_API_KEY ANTHROPIC_API_KEY GOOGLE_API_KEY; do
	if [ -n "${!var_name:-}" ]; then
		has_keys=1
	fi
done

if [ "$has_keys" = "1" ]; then
	if [ "${NOVAX_ENABLE_MOCKS:-1}" != "0" ]; then
		echo "ERROR: Provider keys detected but NOVAX_ENABLE_MOCKS is not 0. Set NOVAX_ENABLE_MOCKS=0 for production builds." >&2
		exit 1
	fi
fi

echo "Environment guard passed."