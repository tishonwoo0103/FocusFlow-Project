# FocusFlow

Project Building Space for planning and building the FocusFlow student project.

## Current Version

FocusFlow V4 moves the shared team task system from browser-only storage to Vercel API routes backed by Upstash Redis.

- One shared task list for Tishon and Mia
- Two independent completion checkboxes on every task
- Server-derived `Next Up`, `In Progress`, and `Completed` states
- Shared task creation, editing, deletion, and activity
- Five-second polling plus refresh on window focus
- Idempotent import of the 66-day V3 schedule and supported legacy browser tasks
- No login, passwords, task ownership, roles, or personal task lists

The other FocusFlow workspaces continue to use the existing lightweight browser storage model.

## Stack

- Next.js 14 Pages Router
- TypeScript
- Tailwind CSS
- Upstash Redis through server-only Next.js API routes
- Vercel deployment from GitHub

## Shared Storage Setup

1. Open the FocusFlow project in Vercel.
2. Open **Storage** or **Marketplace**.
3. Add an Upstash Redis integration and connect it to FocusFlow.
4. Confirm these variables exist in the **Preview** environment:

```text
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

5. Redeploy the `dev` preview after adding the variables.
6. Open the preview as Tishon and select **Import Local Tasks** once.
7. Wait for that import to finish before Mia starts using the shared task system.

For a local shell only, create `.env.local` from `.env.example` and add the real values. Never commit `.env.local` or either secret.

## Migration

The one-time import sends legacy task data from supported `focusflow:v5:tasks` through `focusflow:v8:tasks` keys to `/api/shared/bootstrap`.

- The server always includes the repository's 66-day schedule.
- Matching schedule tasks use stable current IDs and dates.
- Legacy `Completed` tasks become completed by both collaborators.
- Other legacy tasks start unchecked for both collaborators.
- Repeated bootstrap requests return safely without overwriting remote data.
- Empty browser storage never deletes or replaces existing shared tasks.

After migration, tasks, completion state, edits, and activity use Redis only. Local storage remains allowed for the `Updating as` device preference and migration marker.

## API

```text
GET    /api/shared/tasks
POST   /api/shared/tasks
PATCH  /api/shared/tasks/:id
DELETE /api/shared/tasks/:id
GET    /api/shared/activity
POST   /api/shared/bootstrap
```

Redis keys:

```text
focusflow:shared:v1:tasks
focusflow:shared:v1:activity
focusflow:shared:v1:initialized
```

The Redis token is read only by server-side API code. Browser code never receives it.

## Verification

Run before accepting a change:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Testing uses the Vercel preview created from `dev`. Verify Dashboard, Today, Calendar, Collaborator Mode, Wix Learning, Evidence, Website Planning, Vibe Coding, and Wix Development. Do not use the production site as a test environment.

For synchronization, open the preview in one normal browser window as Tishon and one private window as Mia. Confirm task creation, editing, each completion checkbox, status changes, activity, polling, and refresh persistence.

## Git Workflow

- GitHub repository: `tishonwoo0103/FocusFlow-Project`
- Active development branch: `dev`
- Production branch: `main`
- Production site: `https://focus-flow-project-jet.vercel.app/`

Make changes on `dev`, run checks, push only after approval, and verify the Vercel preview. Never merge `dev` into `main` without explicit approval. Never force push.

## Security Limitation

Collaborator attribution is trust-based, not authentication. Anyone who can reach the deployed API can submit writes as Tishon or Mia. The Redis secret remains protected, but the API itself is intentionally public-write because V4 does not include accounts or permissions. Add authentication and authorization before sharing the app with an untrusted public audience.
