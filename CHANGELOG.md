# Changelog

## FocusFlow V4 - 2026-06-19

Implemented truly shared team tasks for Tishon and Mia on the `dev` branch.

- Added server-only Upstash Redis access and shared task, activity, and bootstrap API routes.
- Added independent Tishon and Mia completion values with server-derived task status.
- Added atomic task updates that preserve the other collaborator's latest checkbox value.
- Added shared task polling, focus refresh, retry behavior, and retained last successful data.
- Restored Calendar task creation and added shared editing and deletion.
- Replaced the local owner/review collaborator board with trust-based update attribution.
- Added a shared Dashboard activity feed capped at the latest 100 server records.
- Added an idempotent migration for the 66-day schedule and supported legacy browser task keys.
- Added shared-task contract tests for status derivation, migration, validation, schedule preservation, and unavailable-storage behavior.
- Corrected Upstash response deserialization so Redis hashes return task records keyed by task ID.
- Documented Vercel Upstash setup, environment variables, migration, and public-write security risk.
- Kept `main` unchanged and deferred all remote pushes until user approval.

## FocusFlow V3.5 - 2026-06-17

Added Collaborator Mode for building FocusFlow with Mia.

- Added a Collaborator page with shared goal, next check-in, GitHub branch, handoff note, and review focus.
- Added fixed collaborator work items for Wix learning links, evidence summaries, and homepage copy review.
- Added owner, task status, review status, GitHub branch, handoff note, check-in note, and checklist tracking for each collaborator item.
- Added a dashboard Collaborator Mode summary so Mia-related work is visible from the home page.
- Added local storage key migration to `focusflow:v8:*` with `v7`, `v6`, and `v5` fallbacks.
- Kept the feature local-only with no authentication, backend, database, or GitHub write automation.

## FocusFlow V3.0 - 2026-06-17

First successful GitHub + Vercel deployment.

Status:

- Production deployment operational.

Completed:

- Git recovery.
- GitHub integration.
- Vercel deployment.
- Next.js deployment configuration.
- Local deployment-readiness verification with `npm install`, `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build`.

Next phase:

- FocusFlow feature development.

## 2026-06-16

- Upgraded FocusFlow Project Building Space to V3 with an exact 66-day summer build schedule.
- Added 8 build stages from Blueprint through Launch Prep.
- Added one scheduled task per day from 2026-06-21 through 2026-08-25.
- Expanded tasks with stage, what to do, checklist, deliverable, estimated time, and completion status.
- Updated Dashboard, Today, and Calendar Tasks to use the V3 schedule.
- Bumped local storage keys to `focusflow:v7:*` and added fallback migration from previous schedule keys.
- Added infrastructure readiness docs for GitHub collaboration and Vercel deployment.
- Added the local release checkpoint target: FocusFlow V3 Stable.
- Added Node engine metadata for deployment consistency.
- Shifted the schedule so Day 1 starts on 2026-06-21 and the final readiness review lands on 2026-08-25.

## 2026-06-15

- Fixed a Wix Learning Center runtime crash caused by older saved browser data missing the new curriculum fields.
- Added local storage normalization for tasks, curriculum stages, research domains, Vibe Coding items, and Wix Development items.
- Added defensive Wix Learning rendering so missing nested fields do not crash the page.
- Added defensive checklist rendering to the Vibe Coding and Wix Development workspaces.
- Added project recovery and safety documentation.
