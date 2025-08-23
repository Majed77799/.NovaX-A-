#!/usr/bin/env bash
set -euo pipefail

# Updates all open PRs by prepending the repository's PR template if missing,
# ensuring the Health Gate checklist is present.

if [[ -z "${GITHUB_TOKEN:-}" && -z "${GH_TOKEN:-}" ]]; then
  echo "Error: GITHUB_TOKEN or GH_TOKEN must be set to update PRs via the GitHub API." >&2
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

# Read template content and prepare for JSON
TEMPLATE_PATH=".github/pull_request_template.md"
if [[ ! -f "$TEMPLATE_PATH" ]]; then
  echo "Error: $TEMPLATE_PATH not found in repository." >&2
  exit 1
fi

TEMPLATE_CONTENT=$(cat "$TEMPLATE_PATH")

echo "Fetching open PRs for ${REPO_FULL}..."
PRS_JSON=$(curl -sS "${HDRS[@]}" \
  "${API}/repos/${OWNER}/${REPO_NAME}/pulls?state=open&per_page=100")

PR_COUNT=$(echo "$PRS_JSON" | jq 'length')
if [[ "$PR_COUNT" == "0" ]]; then
  echo "No open PRs found."
  exit 0
fi

UPDATED=0
for ROW in $(echo "$PRS_JSON" | jq -r '.[] | @base64'); do
  _jq() { echo "$ROW" | base64 --decode | jq -r "$1"; }
  NUMBER=$(_jq '.number')
  TITLE=$(_jq '.title')
  BODY=$(_jq '.body // ""')

  if echo "$BODY" | grep -qEi '^\s*#{2,6}\s*Health Gate\s*$'; then
    echo "#${NUMBER} already has Health Gate section. Skipping."
    continue
  fi

  echo "Updating PR #${NUMBER}: ${TITLE}"
  NEW_BODY=$(jq -Rn --arg t "$TEMPLATE_CONTENT" --arg b "$BODY" '$t + "\n\n---\n\n" + $b')

  curl -sS -X PATCH "${HDRS[@]}" \
    -d "{\"body\": ${NEW_BODY}}" \
    "${API}/repos/${OWNER}/${REPO_NAME}/pulls/${NUMBER}" > /dev/null
  UPDATED=$((UPDATED+1))
done

echo "Updated ${UPDATED} PR(s) with the template."

