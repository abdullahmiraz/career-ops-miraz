# Custom Instructions -- career-ops

<!-- ============================================================
     THIS FILE IS YOURS. It will NEVER be auto-updated.

     Put your own house rules, custom workflows, and automations
     here -- anything you want the agent to ALWAYS do (or never do).

     This is for PROCEDURAL rules ("HOW I want things done").
     For WHO you are (archetypes, narrative, comp, negotiation),
     use modes/_profile.md instead. Keeping the two separate keeps
     each one readable.

     The agent reads this file alongside the system instructions;
     your rules here take precedence over the defaults, as long as
     they don't break the Data Contract (your files are never
     touched, and we never auto-submit an application for you).

     Because this is a user-layer file, anything you write here
     survives `node update-system.mjs`. Put customizations HERE,
     not in CLAUDE.md / modes/_shared.md / other system files --
     those get overwritten on update.
     ============================================================ -->

## House Rules

- **This is a personal fork of `santifer/career-ops`, used as a live backup of my own data** (cv.md, config/profile.yml, portals.yml, modes/_profile.md, modes/_custom.md, data/*, reports/*). These files are intentionally TRACKED here (not gitignored) — commit and push them to `origin` (my own fork) freely, same as any code change.
- Before pushing (any push, to any remote), the repo's `.githooks/pre-push` hook runs automatically via `core.hooksPath` — it blocks pushes to the upstream repo outright, scans for accidentally-staged secret files (`.env`, `*.pem`, private keys), and blocks removal of `.github/workflows/no-user-data.yml` (the CI guard that hard-fails any PR touching personal-data paths). **If this repo is ever re-cloned on another machine, run `git config core.hooksPath .githooks` once** — the setting itself is local git config, not something a clone inherits automatically, only the hook file does.
- `origin` = my own fork (push freely). `upstream` = `santifer/career-ops`, fetch-only by design (`git fetch upstream` / `git merge upstream/main` to sync updates) — its push URL is deliberately invalid.

<!-- Other rules the agent should always follow. Examples:
     - Always write evaluation summaries in British English.
     - Never include a photo in my CV (US / ATS-first market).
     - Cap each batch run at 20 listings unless I say otherwise.
     - If a report scores below 6, skip the cover letter. -->

(add more above as they come up)

## Custom Workflows

<!-- Multi-step routines you run often, given a short name. Examples:
     - "weekly review": scan my saved portals, evaluate the new roles,
       then give me a one-paragraph summary of the top 3.
     - "prep <company>": pull the JD, generate STAR stories from
       article-digest.md, and draft 5 likely interview questions. -->

(none yet -- add yours above)

## Output Preferences

<!-- How you like results formatted. Examples:
     - Reports: lead with the score and the one-line verdict.
     - Show the per-step token breakdown after a batch run.
     - Save PDFs date-first: YYYY-MM-DD-company.pdf -->

(none yet -- add yours above)

## Off-Limits

- Never push, create a PR, or open a merge request against `upstream`/`santifer/career-ops` on my behalf. This fork syncs FROM upstream only (fetch/merge); it never contributes back.
- Never bypass the `.githooks/pre-push` guard (`git push --no-verify`) without asking me first and explaining why it's blocking.

<!-- Other things the agent must never do for you. Examples:
     - Never auto-fill or submit an application without showing me first.
     - Never edit a system file to customize my setup -- put it here. -->

(add more above as they come up)
