# eco360-webpage

## Push to main

This repo is pushed directly to main (no branches or PRs by default).

- Before every push to main: run `npm test` and push only if it is green.
- Never chain edit → commit → push in one command unless every step is joined with `&&` (or `set -e`), so a failed step stops the chain.
- After a push, confirm the Vercel deployment status for that commit (`gh api repos/jyriroselius-cloud/eco360-webpage/commits/<sha>/status` or `vercel ls --prod`), not just the live page.

## Vercel build gate

- Vercel's build runs `npm run test:build` (offline, incl. `vercel.json` config checks); a failing test blocks the deploy.
- After every push to main, once the deploy is green, run `npm run test:live` against production and report the result.
- `npm test` runs everything (offline + live) and stays the pre-push check.
