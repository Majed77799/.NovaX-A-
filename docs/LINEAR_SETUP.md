# Linear Setup for NovaX

This repository supports automatic synchronization with Linear. If you have not connected Linear yet, follow the steps below.

## Prerequisites
- A Linear account and access to the NovaX workspace
- Permission to create API keys and view Team settings

## 1) Create a Linear API Key
1. Open Linear → Settings → Developer → Personal API Keys
2. Click “Create new” and copy the generated key
3. Store it as `LINEAR_API_KEY` in your environment (see below)

## 2) Find your Linear Team ID
Option A (UI URL):
- Open your Team in Linear. The URL often contains a team identifier like `https://linear.app/<workspace>/team/<team-name>-<team-id>` where the trailing segment includes the team ID.

Option B (GraphQL explorer):
1. Open `https://linear.app/graphql` while logged in
2. Use this query:

```graphql
query {
  teams(first: 50) {
    nodes { id key name }
  }
}
```
3. Copy the `id` of the team you want to use and set it as `LINEAR_TEAM_ID`

## 3) Webhook secret (optional for later phases)
- Generate a random secret (e.g., using `openssl rand -hex 32`) and set it as `LINEAR_WEBHOOK_SECRET` if you plan to verify incoming webhooks

## 4) Configure environment variables
- Copy `.env.example` to your local `.env` (or `.env.local` if your tooling expects that)
- Fill in the following:

```
LINEAR_API_KEY=lin_api_xxx
LINEAR_TEAM_ID=team_xxx
LINEAR_WEBHOOK_SECRET=your-random-secret
```

## 5) GitHub repository secrets (for GitHub Actions)
In your GitHub repository settings → Secrets and variables → Actions, add:
- `LINEAR_API_KEY`
- `LINEAR_TEAM_ID`
- `LINEAR_WEBHOOK_SECRET` (optional until webhooks are enabled)

## 6) Verify your setup
Run the check script locally:

```bash
npm run linear:check
```

- If keys are missing, the script will print actionable hints and exit gracefully.
- Once keys are present, subsequent phases (labels, projects, and sync automation) will proceed in CI when enabled.

## Notes
- All automation is idempotent. Re-running the sync will not create duplicate labels, projects, or issues.
- For help, see `scripts/linear/check.ts` for the exact validations performed.