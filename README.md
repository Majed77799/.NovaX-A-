# NovaX AI — Static Site

This repository contains a single-page static site (`index.html`).

## Deploy to Vercel

You can deploy this site to Vercel in two ways.

### Option A — Via Vercel Dashboard (recommended)
- Create a new project at the Vercel dashboard: https://vercel.com/new
- Select your Git provider/repo containing this code.
- Framework Preset: "Other" (Static Site). Build command: none. Output directory: `/`.
- Click Deploy.

### Option B — Via Vercel CLI
Prerequisites:
- Have a Vercel account
- Node.js 18+ and npm

Steps:
1. Install the Vercel CLI
   ```bash
   npm i -g vercel
   ```
2. (Non-interactive) Set your token and deploy:
   ```bash
   export VERCEL_TOKEN=YOUR_VERCEL_TOKEN
   vercel --yes --prod --token "$VERCEL_TOKEN"
   ```
   If you do not have a token yet, run interactive login once:
   ```bash
   vercel login
   vercel --prod
   ```

On success, Vercel will print the deployment URL. You can promote a preview to production later as needed.

## Project Structure
- `index.html`: Root static file served by Vercel.
- `site/`: Source backup where the original content was stored (`metin.txt`).

## Notes
- No build step is required for this project.
- You can add a `vercel.json` later for advanced routing, headers, or caching if needed.