# Asset Tracking Challenge - A-coder152 (Abdullah Salim)

## Deployed app
https://ai-builder-challenge-cerebras-start-teal.vercel.app

## Deployment configuration
You **must** configure the following environment variables in your Vercel project settings for the frontend to communicate with your backend:

- `API_BASE_URL`: The full URL of your deployed Render backend (e.g., `https://your-api.onrender.com/v1`).
- `API_TOKEN`: A secure bearer token to authenticate your frontend's requests to the backend.

Failure to set these will cause the frontend to attempt to connect to `localhost`, which will fail.

## Reviewer quick path

1. Open `/dev/barcodes` and print the test labels.
2. Use `/tech/deploy` with a stored asset and a rack barcode (e.g., `rack:SFO/R201/A/R4/RU12`).
3. Confirm the success state shows Operations, Facilities, and Finance sync statuses.
4. Open `/manager/reconcile` and filter for "Action needed."
5. Use `/tech/store` on an in-service asset and confirm Facilities rack record is cleared.
6. Open `/manager/assets/[tag]` and inspect the unified system snapshot and event timeline.

## What was built

A high-trust asset management system that reconciles Operations (source of truth), Facilities (racking), and Finance (capitalization) data. It features optimized field-worker workflows and an exception-first management dashboard.

## Architecture

- **Next.js Route Handlers**: `/api/scans/*` proxies prevent client-side token leakage.
- **Orchestration**: Logic is scan-specific (Deploy writes Facilities/Finance; Store de-racks only when appropriate).
- **Forensics**: A server-side union join across all three systems powers the reconciliation report and asset detail views.

## Tech scan workflows

Each tech workflow (receive, store, deploy, transfer) is built on a reusable `ScanWorkflowShell` that supports keyboard/USB scanners (via `ScanField`) and native camera-based scanning (via `CameraScanner`).

## Facilities/Finance writebacks

Writebacks are orchestrated server-side within the specific scan route handlers. Facilities and Finance data are updated consistently and idempotent state changes are enforced.

## Three-way reconciliation

A server-side union join compares Operations, Facilities, and Finance data. Discrepancies are categorized by severity and actionability to help managers triage 1,000+ assets in minutes.

## Manager dashboard/detail design

- **Dashboard**: Exception-first "morning triage" view with summary cards for critical action items.
- **Forensic View**: A "Truth Panel" displays side-by-side snapshots from Operations, Facilities, and Finance, paired with a chronological event timeline.

## Barcode test harness

The `/dev/barcodes` page generates scannable labels for all test cases, including happy-path assets, drift cases, and system orphans, with print-ready CSS.

## Tests

- `starter/test/reconcile.test.ts`: Tests reconciliation join and categorization logic.
- `starter/test/writebacks.test.ts`: Tests server-side writeback orchestration for different scan types.
- `starter/test/location.test.ts`: Validates rack location parsing rules.

## Three calls I nearly made the other way

1. **Server Orchestration vs. Generic Sync**: I initially considered a generic `/api/sync-mocks` endpoint. I replaced it with scan-specific handlers because each scan has distinct downstream writeback rules (e.g., deploy writes both, store only de-racks for in-service assets).
2. **Exception-First Dashboard**: I prioritized exceptions and recent movements because a manager needs to know "what needs action?" in seconds, not sort through a 1,000-asset list.
3. **Scan UX**: I kept focused inputs as the default to support USB/Bluetooth scanners, while adding camera scanning as a native secondary path for mobile workflows.

## Things I intentionally did not build

- **Full Auth**: I utilized the starter's role switcher as the user context to keep the focus on domain logic and reconciliation.
- **Client-Side Filtering**: I deferred full pagination/filtering to the API layer where possible for performance, keeping client-side filtering lightweight.

## Known limitations

- The mock Facilities/Finance systems do not support full transactional integrity (they are mock APIs).
- Camera scanning relies on browser permissions and camera availability, with manual entry as the required fallback.

## Pushback / confusing brief notes

- The brief asks for three scan endpoints but also explicitly requires `/tech/transfer`, which necessitated adding a fourth route.
- GET /health is different from all other routes having a /v1/x. Standardizing would have made it simpler.
