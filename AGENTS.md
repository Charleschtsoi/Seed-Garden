# Seed Garden

Seed Garden is a calm meditation + mood-journaling web experience for the Hong Kong
community. See `seed-garden-workflow.md` for full product specs and the page map.

## Cursor Cloud specific instructions

- This is a **pure static site** (plain HTML + CSS + vanilla JS). There is no
  `package.json`, no bundler, and no dependency install step — nothing needs to be
  installed to develop or run it.
- **Run it (dev):** serve the repo root over HTTP, e.g. `python3 -m http.server 8000`
  (Python 3 is preinstalled), then open `http://localhost:8000/index.html`. Do not just
  open files with `file://` — the JS uses fonts/assets via relative paths and is best
  served over HTTP.
- **No lint / test / build commands exist.** Do not look for `npm run build`/`test`;
  there is no tooling. Validation is manual in the browser.
- All interactivity is client-side and state is stored in `localStorage`
  (e.g. journal entries under `seed-garden-journal-entries`). There is no backend or
  database.
- **Core clickable flow:** `index.html` → `meditate.html` → `session.html` →
  `complete.html` → `check-in.html` → `journal.html`. Append `?demo=1` to
  `meditate.html` (i.e. `meditate.html?demo=1`) to run an ~8-second demo session timer
  instead of a full-length meditation — use this for quick end-to-end walkthroughs.
- Deployment is Vercel with `cleanUrls: true` (extensionless URLs in prod). Internal
  links in the repo still use explicit `.html`, so a plain static server like
  `http.server` works locally without any rewrite config.
