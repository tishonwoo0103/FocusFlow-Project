# FocusFlow Agent Guide

## Scope

These instructions apply to the entire FocusFlow repository.

## Mission

Build and maintain FocusFlow Project Building Space, a simple project headquarters for a student founder preparing a neuroscience-based community service initiative.

Choose solutions in this order:

1. Impact
2. Usability
3. Simplicity
4. Maintainability
5. Technical sophistication

Use the smallest solution that creates meaningful value. Keep the code readable for a beginner developer and avoid unnecessary abstractions.

## Read Before Editing

Review these files before making changes:

1. `README.md`
2. `PROJECT_STATUS.md`
3. `docs/CONTINUITY.md`
4. `docs/TASKS.md`
5. `docs/DECISIONS.md`
6. `docs/DEVELOPMENT_PLAN.md`
7. `RECOVERY_GUIDE.md`

For feature-specific context, also read the matching file under `docs/` and inspect the existing page, components, types, data, state hook, and normalizer before editing.

## Current Product

- Version: FocusFlow V4
- Framework: Next.js 14 Pages Router
- Language: TypeScript
- Styling: Tailwind CSS
- Icons: Lucide React
- Persistence: Upstash Redis for shared tasks/activity; browser local storage for other planning workspaces
- Schedule: 66 daily tasks from 2026-06-21 through 2026-08-25
- Collaboration: shared team tasks for Tishon and Mia with trust-based attribution
- Deployment: GitHub `dev` to Vercel Preview; `main` to production only after approval

Do not add authentication, a backend, a database, cloud synchronization, AI integrations, permissions, or automated GitHub writes unless the user explicitly requests them and the value clearly justifies the added complexity.

## Architecture

Follow the existing repository structure:

- `src/pages/`: page routes using the Pages Router
- `src/components/`: shared presentation components
- `src/types/index.ts`: shared data types and allowed values
- `src/lib/summerSchedule.ts`: source of truth for the eight-stage, 66-day schedule
- `src/lib/initialData.ts`: default application data
- `src/lib/operatingSystem.ts`: local state for non-task planning workspaces
- `src/lib/storage.ts`: local storage behavior
- `src/lib/normalizers.ts`: defensive migration and saved-data normalization
- `src/lib/selectors.ts`: derived task and schedule data
- `src/lib/sharedTasksServer.ts`: validated shared task service and Redis mutations
- `src/hooks/useSharedTasks.ts`: client synchronization and mutation interface
- `src/pages/api/shared/`: server-only shared task API routes
- `src/styles/globals.css`: shared visual styles

Prefer existing components, CSS classes, data shapes, and state patterns. Add a new abstraction only when it removes real complexity or clearly matches an established pattern.

## Behavior To Preserve

- Dashboard roadmap uses eight stages from Blueprint through Launch Prep.
- The schedule contains exactly 66 ordered daily tasks.
- Day 1 is 2026-06-21 and Day 66 is 2026-08-25.
- Today shows only work scheduled for the current date.
- Future schedule sections exclude today's work and group tasks by date.
- Calendar tasks support completion without losing existing saved progress.
- Task states are limited to `Next Up`, `In Progress`, and `Completed`.
- Wix Learning remains a guided five-stage curriculum.
- Research remains a six-domain evidence library.
- Website Planning remains split into Vibe Coding and Wix Development.
- Every task is shared and shows independent Tishon and Mia completion values.
- Task status is derived server-side: neither checked is Next Up, one checked is In Progress, both checked is Completed.
- Tasks and activity do not silently fall back to local storage.
- Older supported local task data imports once into `focusflow:shared:v1:*` Redis data.

Do not restore retired meeting-management, task-ranking, or stalled-work systems unless the user explicitly changes the product direction.

## Development Workflow

For every feature:

1. Analyze the requirement and identify affected files.
2. Explain the implementation plan and architecture choice.
3. Build the smallest working version.
4. Test the changed behavior and nearby routes.
5. Update the relevant documentation.
6. Update project status and continuity files when the change is significant.

Work with the current Git tree. Never discard unrelated edits, and never rewrite user changes just to make the tree clean.

## Implementation Rules

- Keep changes narrowly scoped to the request.
- Prefer readable code over clever code.
- Use descriptive names and short comments only where logic is not self-explanatory.
- Use TypeScript types instead of unstructured objects.
- Normalize data read from local storage before rendering it or importing it into shared storage.
- Provide safe defaults for optional or older saved fields.
- Preserve task completion by stable identifier when migrating data.
- Avoid silently deleting browser data.
- Keep fixed curriculum and workspace structures in default data rather than adding unnecessary create/delete systems.
- Use Lucide icons already available in the project.

## Interface Direction

The interface should feel clean, calm, strategic, student-founder focused, and action-oriented.

- Reuse existing surfaces, panels, badges, controls, spacing, and typography.
- Keep dashboards easy to scan and daily actions easy to execute.
- Use familiar controls for checkboxes, selects, links, and editing fields.
- Keep layouts responsive and prevent text or controls from overlapping.
- Do not redesign unrelated pages during a focused change.
- Do not add marketing-style landing sections to the project workspace.

## Verification

Run the available checks before accepting a code change:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Then verify the affected route and nearby workflows in the Vercel `dev` preview. For major changes, check:

- `/`
- `/today`
- `/tasks`
- `/collaborator`
- `/wix`
- `/research`
- `/website`
- `/vibe-coding`
- `/wix-development`

For schedule changes, verify the stage count, task count, first date, final date, task order, and completion migration. For local storage changes, test both fresh defaults and older supported saved shapes.

If a command cannot run, report that clearly and use the closest direct check available without claiming the original command passed.

## Documentation

For major changes, update:

- `PROJECT_STATUS.md`
- `docs/PROJECT_STATUS.md`
- `docs/TASKS.md`
- `docs/CONTINUITY.md`
- `CHANGELOG.md`

Add an entry to `docs/DECISIONS.md` when making an architectural or product decision. Add a concise note to `docs/LEARNING_LOG.md` when the work creates a reusable lesson.

Keep status documents factual. Do not mark work complete until implementation and verification are complete.

## Git And Deployment Safety

- Inspect `git status` before and after editing.
- Work on `dev` unless the user explicitly requests another branch.
- Keep commits small and clearly named.
- Run verification before merging or pushing.
- Do not force push.
- Do not delete files unless they are clearly unused and the deletion is part of the request.
- Do not commit `.env*`, `.next/`, `node_modules/`, or `.vercel/` files.
- Push only `origin/dev` after explicit approval. Never merge `dev` into `main` automatically.
- Do not run remote Git or Vercel actions unless the user has requested or confirmed them.

Follow `RECOVERY_GUIDE.md` when a page breaks or a change needs to be restored.

## Definition Of Done

A change is complete only when:

- The requested behavior works.
- Existing related behavior still works.
- Saved data is handled safely.
- Type and build checks pass when available.
- Relevant routes are verified.
- Required documentation is current.
- Remaining risks and tasks are reported honestly.

## Current Next Work

The current project tasks are:

- Add real Wix learning resource links.
- Add real research sources and evidence summaries.
- Configure Upstash Redis for the Vercel `dev` preview.
- Verify shared task synchronization in normal and private browser windows.
- Start the June 21 Blueprint schedule.
- Keep `main` deployable through small branches and verified merges.
