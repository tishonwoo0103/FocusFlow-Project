# Decisions

## 2026-06-12: Use Local Storage Only

Decision: Store project state, tasks, curriculum stages, evidence items, vibe coding items, and Wix development items in browser local storage.

Reason: The founder needs a simple local MVP, not account management or backend complexity.

## 2026-06-12: Use Next.js Pages Router

Decision: Build the app with a straightforward Pages Router structure under `src/pages`.

Reason: It is easy to understand, easy to expand, and appropriate for a beginner-friendly build.

## 2026-06-12: Keep Data Models Small

Decision: Each feature keeps only the fields needed for planning and action.

Reason: More fields can be added later, but the current product should stay easy to maintain.

## 2026-06-14: Keep Verification Simple

Decision: Use TypeScript and Next.js build checks as the primary verification path.

Reason: The app is small, and beginner-friendly maintenance matters more than adding a large test framework before the workflows stabilize.

## 2026-06-15: Refactor Into FocusFlow Project Building Space

Decision: Replace the old operating-system model with a roadmap dashboard, executable Today view, calendar tasks, staged Wix curriculum, evidence library, and separate Vibe Coding and Wix Development workspaces.

Reason: The new structure fits the student-founder workflow more directly and removes concepts that no longer help FocusFlow move forward.

## 2026-06-15: Keep Calendar And Curriculum Lightweight

Decision: Build the monthly calendar, Today schedule, guided Wix curriculum, and research domains with local React state and local storage.

Reason: The requested workflows need clarity and editing, not a full calendar package, backend, or content management system.

## 2026-06-15: Make Website Planning A Workspace Hub

Decision: Add a Website Planning Center that links to Vibe Coding and Wix Development, while each workspace uses fixed strategic items with editable checklists and completion percentages.

Reason: FocusFlow needs a project headquarters that guides action instead of a loose database of pages and prompts.

## 2026-06-15: Normalize Saved Browser Data

Decision: Add a small normalization layer when reading local storage for tasks, curriculum stages, research domains, and workspace items.

Reason: The app is still changing quickly, so older saved browser data should fall back safely to the current beginner-friendly shapes instead of crashing a page.

## 2026-06-16: Use An Exact Summer Schedule Source

Decision: Add `src/lib/summerSchedule.ts` as the source of truth for the 8 V3 stages and 66 scheduled daily tasks.

Reason: The founder needs a precise daily build path for the real Wix website and Grade 10 pilot, while the app should stay simple and local.

## 2026-06-16: Migrate Shifted Schedule Data Safely

Decision: Move the shifted schedule to `focusflow:v7:*` local storage keys and read earlier `v6` and `v5` keys as fallbacks.

Reason: The schedule dates changed, but completed seeded tasks should keep their status whenever the old task can be matched safely.

## 2026-06-16: Keep Vercel Link Private

Decision: Document Vercel readiness without committing `.vercel/` project-link files.

Reason: Vercel project links can contain local account/project metadata. The safer workflow is to import the GitHub repo in Vercel after the stable checkpoint is pushed.

## 2026-06-17: Use GitHub And Vercel As The Stable Collaboration Baseline

Decision: Treat the GitHub `main` branch and Vercel production deployment as the FocusFlow V3.0 baseline, while Mia collaboration work happens in focused feature branches.

Reason: The project now has a working production deployment, so future changes should protect `main` and keep deployment recovery simple.

## 2026-06-17: Keep Collaborator Mode Local

Decision: Build V3.5 Collaborator Mode as local storage planning data with fixed collaboration work items, owner fields, review states, branch notes, handoff notes, check-in notes, and checklists.

Reason: Tishon and Mia need a simple shared workflow for deciding who does what next. Real accounts, live sync, permissions, and GitHub automation would add complexity before the project needs it.

## 2026-06-19: Move Team Tasks To Shared Redis Storage

Decision: Replace the V3.5 local collaborator board and local task source with one Upstash Redis-backed team task system. Keep Redis access inside Next.js API routes and derive task status server-side from independent Tishon and Mia completion values.

Reason: Tishon and Mia now need task creation, edits, completion, and activity to stay consistent across separate browsers. A small Redis service provides measurable collaboration value without adding accounts, roles, or a complex database.

## 2026-06-19: Preserve The Actual 66-Day Repository Schedule

Decision: Bootstrap all 66 current V3 schedule tasks even though the V4 prompt mentions 56 days.

Reason: The verified repository source, status documents, and previous schedule requirement all define 66 ordered days from June 21 through August 25. Removing ten tasks would be destructive and conflict with the active source of truth.

## 2026-06-19: Keep Attribution Trust-Based

Decision: Keep a device-local `Updating as` selector and send the selected collaborator with each mutation. Do not add authentication or task ownership.

Reason: The requested V4 scope needs visible attribution, not identities or permissions. The resulting public-write risk is documented for future hardening.
