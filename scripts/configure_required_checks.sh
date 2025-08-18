#!/usr/bin/env bash
set -euo pipefail

# Configures branch protection to require CI checks for merge.
# Requires a GitHub token with repo admin permissions.

if [[ -z "${GITHUB_TOKEN:-}" && -z "${GH_TOKEN:-}" ]]; then
  echo "Error: GITHUB_TOKEN or GH_TOKEN must be set to configure branch protection." >&2
  exit 1
fi

TOKEN="${GITHUB_TOKEN:-${GH_TOKEN:-}}"

# Resolve owner/repo from env or git remote
if [[ -n "${REPO:-}" ]]; then
  REPO_FULL="$REPO"
else
  REMOTE_URL=$(git config --get remote.origin.url || true)
  if [[ -z "$REMOTE_URL" ]]; then
    echo "Error: Could not determine git remote origin. Set REPO=owner/repo." >&2
    exit 1
  fi
  if [[ "$REMOTE_URL" =~ ^git@github.com:(.+)\.git$ ]]; then
    REPO_FULL="${BASH_REMATCH[1]}"
  elif [[ "$REMOTE_URL" =~ ^https://github.com/(.+)\.git$ ]]; then
    REPO_FULL="${BASH_REMATCH[1]}"
  elif [[ "$REMOTE_URL" =~ ^https://github.com/(.+)$ ]]; then
    REPO_FULL="${BASH_REMATCH[1]}"
  else
    echo "Error: Unrecognized remote URL format: $REMOTE_URL" >&2
    exit 1
  fi
fi

OWNER="${REPO_FULL%%/*}"
REPO_NAME="${REPO_FULL#*/}"
API="https://api.github.com"
HDRS=(
  -H "Accept: application/vnd.github+json"
  -H "Authorization: Bearer ${TOKEN}"
  -H "X-GitHub-Api-Version: 2022-11-28"
)

# Determine default branch
DEFAULT_BRANCH=$(curl -sS "${HDRS[@]}" "${API}/repos/${OWNER}/${REPO_NAME}" | jq -r '.default_branch')
if [[ -z "$DEFAULT_BRANCH" || "$DEFAULT_BRANCH" == "null" ]]; then
  echo "Error: Could not determine default branch." >&2
  exit 1
fi

echo "Default branch is ${DEFAULT_BRANCH}"

# Determine if LINEAR_CONNECTED repo variable is set to 'true'
LINEAR_CONNECTED=false
VARS_JSON=$(curl -sS "${HDRS[@]}" "${API}/repos/${OWNER}/${REPO_NAME}/actions/variables" || true)
if echo "$VARS_JSON" | jq -e '.variables' >/dev/null 2>&1; then
  VAL=$(echo "$VARS_JSON" | jq -r '.variables[] | select(.name=="LINEAR_CONNECTED") | .value' || true)
  if [[ "$VAL" == "true" ]]; then
    LINEAR_CONNECTED=true
  fi
fi

REQUIRED_CONTEXTS=("Health Gate")
if [[ "$LINEAR_CONNECTED" == true ]]; then
  REQUIRED_CONTEXTS+=("Require Linear Key")
fi

echo "Requiring status checks: ${REQUIRED_CONTEXTS[*]}"

PAYLOAD=$(jq -n \
  --argjson contexts "$(printf '%s\n' "${REQUIRED_CONTEXTS[@]}" | jq -R . | jq -s .)" \
  '{
    required_status_checks: {
      strict: true,
      contexts: $contexts
    },
    enforce_admins: true,
    required_pull_request_reviews: {
      required_approving_review_count: 1
    },
    restrictions: null
  }')

curl -sS -X PUT "${HDRS[@]}" \
  -d "$PAYLOAD" \
  "${API}/repos/${OWNER}/${REPO_NAME}/branches/${DEFAULT_BRANCH}/protection" > /dev/null

echo "Branch protection updated for ${OWNER}/${REPO_NAME}@${DEFAULT_BRANCH}."

