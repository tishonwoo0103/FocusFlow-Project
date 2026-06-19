# Continuity

## Current State

FocusFlow V4 is implemented locally on `dev` and awaiting approval for a Vercel Preview push. The app uses Next.js, TypeScript, Tailwind CSS, and server-only Upstash Redis for shared tasks and activity. Non-task planning workspaces remain browser-local.

## What Exists

- Eight-stage roadmap and exact 66-day schedule from 2026-06-21 through 2026-08-25
- Today and monthly Calendar driven by the shared task API
- One team task list visible to Tishon and Mia
- Independent collaborator completion values with server-derived status
- Shared Calendar task creation, editing, deletion, and activity
- Polling every five seconds plus focus refresh and retry behavior
- Idempotent import from supported `focusflow:v5:tasks` through `focusflow:v8:tasks`
- Guided Wix curriculum, Research evidence library, Website Planning, Vibe Coding, and Wix Development
- GitHub `dev` workflow and Vercel Preview deployment path

## Next Best Step

Review the V4 diff. After explicit approval, commit and push only `origin/dev`, configure Upstash for Preview, and run the normal/private two-browser synchronization test.

## Known Issues And Risks

- Vercel Preview needs both Upstash environment variables.
- No authentication means attribution is trust-based and the API permits public writes.
- Polling synchronization can take up to five seconds.
- The local Next.js build can intermittently hit a filesystem timeout during final trace collection.
- Production `main` must remain unchanged until separate approval.

## Continuity Rules

- Keep implementation beginner-readable and narrowly scoped.
- Never use localStorage as a fallback for shared task or activity writes.
- Never overwrite remote data from an empty or stale browser import.
- Update PROJECT_STATUS.md, TASKS.md, and CONTINUITY.md after major changes.
- Push `dev` only after approval; never merge `main` automatically.
