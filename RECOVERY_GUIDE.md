# Recovery Guide

## Restore The Last Working Version

1. Check what changed:

```bash
git status
git diff
```

2. Find the last working checkpoint:

```bash
git log --oneline
```

3. Restore one broken file from the latest commit:

```bash
git restore path/to/file
```

Use this only when you are sure you do not need the uncommitted edits in that file.

## Create A Safe Checkpoint

Before a major change, run:

```bash
npm test
npm run lint
npm run build
git status
git add .
git commit -m "Safe checkpoint before major change"
```

For experimental work, start a branch:

```bash
git switch -c feature/short-description
```

## Recover If Codex Breaks A Page

1. Stop and read the browser error.
2. Run the checks:

```bash
npm test
npm run build
```

3. Inspect the changed files:

```bash
git status
git diff
```

4. Restore only the broken file if needed:

```bash
git restore src/pages/example.tsx
```

5. Reopen the app and verify every main page before continuing.

## Commands Before Accepting A Change

```bash
rg -n "<retired terms from the current audit list>" .
npm test
npm run lint
npm run build
```

For schedule changes, also confirm the schedule audit reports the expected first date, final date, and task count before accepting the change.

Also verify these routes in the browser:

- Dashboard
- Today
- Calendar Tasks
- Wix Learning Center
- Research Hub
- Website Planning

## GitHub Safety Rules

- Use feature branches for larger changes.
- Make a local commit after a page is working.
- Do not force push.
- Do not delete files unless they are clearly unused.

## FocusFlow V3 Stable

The stable checkpoint should be named:

```bash
FocusFlow V3 Stable
```

Recommended local checkpoint commands:

```bash
git status
npm test
npm run lint
npm run build
git add .
git commit -m "FocusFlow V3 Stable"
git tag -a focusflow-v3-stable -m "FocusFlow V3 Stable"
```

Push only after the local checkpoint is verified:

```bash
git push -u origin main
git push origin focusflow-v3-stable
```

If the push fails because Git cannot read a GitHub username, authenticate first:

```bash
gh auth login
```

or push through GitHub Desktop.

## Vercel Recovery

If a Vercel deployment fails:

1. Open the failed deployment logs in Vercel.
2. Confirm `npm install` completed.
3. Confirm `npm run build` used Node `>=18.17.0`.
4. Run the same checks locally.
5. Fix locally, commit, and redeploy from GitHub.

Do not commit `.vercel/`; it can contain local project-link information.

Current Vercel project:

- Name: `focus-flow-project`
- Project ID: `prj_SMuzxjBz5WJ5YpidNKffOT2acKHs`
- Current deployments at setup audit: 0
- Local `.vercel/project.json` may link this folder to the project, but `.vercel/` stays ignored.
