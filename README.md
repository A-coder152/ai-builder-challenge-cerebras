# Asset tracking challenge

A take-home challenge for software engineering interns. Candidates build a frontend on top of a small local backend that simulates the operational asset tracking system of a multi-site research lab.

This is a **monorepo** with two apps you run side by side:

- [`api/`](./api) — small Node/Fastify backend with a seeded SQLite database.
- [`starter/`](./starter) — the Next.js starter that candidates fork. API client, types, base components, and stub pages already wired up.

## Three calls I nearly made the other way

1.  **Sync Logic Location:** I considered implementing the synchronization between operations and external mock systems (facilities/finance) directly on the client side to minimize server complexity. I decided against this because it would expose the API internal URL and potentially leak sensitive authentication/configuration details. Instead, I created a server-side route handler (`/api/sync-mocks`), which follows the project's existing proxy pattern and provides a secure, consolidated sync point.

2.  **Reconciliation Categorization:** Initially, I thought about simply listing all discrepancies in a flat list. I realized that for an asset manager with only 60 seconds at 8:55am, this would be overwhelming. I shifted to a categorized approach (In Sync, Mismatches) to highlight the discrepancies that truly require human attention, making the report actionable rather than just informative.

3.  **Barcode Scanning Library:** I debated between `html5-qrcode` and `@zxing/browser`. `html5-qrcode` has a very popular React wrapper which would have made integration faster. However, `@zxing/browser` felt slightly more lightweight and aligned with my preference for direct control over camera lifecycle management within my `CameraScanner` component, even if it took a bit more boilerplate.

## Flagged Inconsistencies/Bugs

- During development, I noted that the API's `/health` endpoint is at the root level `/health` rather than `/v1/health` as might be expected by the `/v1` prefix of the main API. I adapted the client to handle this correctly.

## Quick start

```bash
pnpm install

# Runs the API on :8080 and the starter on :3000
pnpm dev
```

Open http://localhost:3000.

The starter reads `API_BASE_URL` and `API_TOKEN` from `starter/.env`. Copy `starter/.env.example` to `starter/.env` if you don't have one. Both are server-side only — the browser hits a proxy at `/api/upstream` that adds the token, so it never reaches the client.

## What's in here

| Document | For |
|---|---|
| [`docs/CHALLENGE.md`](./docs/CHALLENGE.md) | The candidate-facing brief |
| [`docs/CONTEXT.md`](./docs/CONTEXT.md) | Background on the kind of system this is and why each piece exists. Optional. |
| [`api/README.md`](./api/README.md) | How to run and test the API |
| [`starter/README.md`](./starter/README.md) | How to run the starter |
| [`starter/docs/api-reference.md`](./starter/docs/api-reference.md) | The API contract |
| [`starter/docs/tips.md`](./starter/docs/tips.md) | Notes for candidates |
| [`starter/docs/happy-path.md`](./starter/docs/happy-path.md) | 10-step smoke test for candidates |

## Testing

```bash
pnpm test          # all packages
pnpm --filter @asset-tracking/api test
pnpm --filter @asset-tracking/starter test
```

## License

MIT. See [LICENSE](./LICENSE).
