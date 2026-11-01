# agent-advisory-api
HTTP API: known security advisories (OSV) for a package/version, built for AI agents & CI.
`GET /check?pkg=lodash&ecosystem=npm&version=4.17.15`
- Paid access: RapidAPI listing — RAPIDAPI_URL_PLACEHOLDER
- Related: [Agent Advisory Gate Pro](https://setrov.gumroad.com/l/zdojns) · [MCP Advisory Flag Pro](https://setrov.gumroad.com/l/hqviee) · [agent-config-audit Team Pack](https://setrov.gumroad.com/l/cpclzn)
## Deploy
- **Deno Deploy (primary):** entrypoint `main.ts` (uses `lib.mjs`), no build step. Env `RAPIDAPI_PROXY_SECRET` (if unset, requests are allowed — smoke-test only).
- **Vercel (alt):** `api/check.js`, `api/health.js`, `vercel.json` (rewrites /check, /health).
- **Node/Docker:** `node server.mjs` or `Dockerfile`. Env `RAPIDAPI_PROXY_SECRET`, `PORT`.

MIT.

## Also available as

- VS Code / Open VSX extension: https://open-vsx.org/extension/elaysuu/agent-package-advisory
- Apify actor: https://apify.com/crimson_goby/osv-package-checker
