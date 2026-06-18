# FocusFlow

Project Building Space for planning and building the FocusFlow student project.

## Current Stable Version

FocusFlow V3.5 is the current release checkpoint.

- 66-day summer build schedule
- 8 roadmap stages from Blueprint to Launch Prep
- Calendar-based daily tasks from 2026-06-21 through 2026-08-25
- Collaborator Mode for Tishon and Mia
- Local browser storage with `focusflow:v8:*` keys and fallback migration from earlier FocusFlow keys
- No backend, authentication, database, or AI integration
- First successful GitHub + Vercel production deployment is operational

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Local storage persistence

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

Run these checks before accepting major changes:

```bash
npm test
npm run lint
npm run build
```

Then open the main pages: Dashboard, Today, Calendar Tasks, Wix Learning Center, Research Hub, and Website Planning.

For V3.5, also open Collaborator Mode and confirm the owner, review status, branch, handoff, check-in, and checklist controls work.

## Collaboration Workflow

For working with Mia:

1. Start from `main`.
2. Pull the latest GitHub version before changing files.
3. Create a branch for each focused change.
4. Run verification before merging.
5. Keep commits small and named clearly.

```bash
git switch main
git pull
git switch -c feature/mia-short-description
npm test
npm run lint
npm run build
git status
```

Suggested branch names:

- `feature/mia-wix-learning-links`
- `feature/mia-research-sources`
- `feature/mia-homepage-copy`

## Safety Workflow

Use Git checkpoints before large refactors:

```bash
git status
git add .
git commit -m "Describe the safe checkpoint"
```

For new work, create a branch first:

```bash
git switch -c feature/short-description
```

## GitHub

The local repo is connected to GitHub:

```bash
https://github.com/tishonwoo0103/FocusFlow-Project.git
```

Production deployments are sourced from the GitHub `main` branch. Push only after local verification passes:

```bash
git push -u origin main
git push origin focusflow-v3-stable
```

If Git asks for credentials, authenticate GitHub first through GitHub Desktop, the GitHub CLI, or a personal access token.

## Vercel

This is a standard Next.js app deployed on Vercel with:

- Install command: `npm install`
- Build command: `npm run build`
- Output: handled automatically by Vercel for Next.js
- Node: `>=18.17.0`

Current Vercel project:

- Project name: `focus-flow-project`
- Project ID: `prj_SMuzxjBz5WJ5YpidNKffOT2acKHs`
- Latest production deployment: `READY`
- Latest deployment URL: `https://focus-flow-project-6szvrvmee-tishonwoo0103-1084s-projects.vercel.app`

A local `.vercel/project.json` link can exist on this machine, but `.vercel/` stays ignored because it should not be committed.
