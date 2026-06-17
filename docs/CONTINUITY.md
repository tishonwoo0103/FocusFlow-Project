# Continuity

## Current State

FocusFlow is a local browser-based Project Building Space for a student founder. The app uses Next.js, TypeScript, Tailwind CSS, and browser local storage. Version 3 keeps the product client-only: no authentication, no backend, no database, and no AI integrations.

## What Exists

- Roadmap dashboard with 8 summer build stages
- Exact 66-day schedule from 2026-06-21 through 2026-08-25
- Today page with goal, current stage, next stage, today-only priorities, and future schedule
- Monthly calendar task management with selected-day tasks
- Guided Wix Learning Center with five stages
- Research Hub with six evidence domains
- Website Planning Center with clickable Vibe Coding and Wix Development workspaces
- Vibe Coding Workspace with fixed build systems, checklist, notes, status, and completion tracking
- Wix Development Workspace with fixed website pages, checklist, notes, status, and completion tracking
- Local storage persistence with `focusflow:v7` keys and fallback migration from earlier schedule keys
- Safe local storage normalization for current FocusFlow data shapes
- GitHub collaboration workflow for Mia
- Vercel deployment readiness notes
- Development plan and audit notes

## Next Best Step

Authenticate GitHub locally, push the FocusFlow V3 Stable checkpoint, then trigger the first Vercel deployment for `focus-flow-project`.

## Known Issues

- Older browser data remains under earlier local-storage keys.
- Remote GitHub push should wait for user confirmation.
- Local Vercel project links are ignored and should not be committed.
- Vercel project `focus-flow-project` exists but has no deployments yet.

## Continuity Rules

- Keep Version 1 and Version 2 beginner-friendly
- Update PROJECT_STATUS.md, TASKS.md, and CONTINUITY.md after major changes
- Prefer small improvements over large rewrites
- Preserve the no-backend architecture unless a future requirement clearly needs more
