# Job City Tracker — standalone static build (DES-160)

**Double-click `index.html`.** No server, no install, no internet. Send the folder (or a zip of it)
to anyone; it also works unchanged on GitLab Pages or any other static host.

The hub page and all 46 city pages live in this one HTML file and are addressed by the part after
the `#`:

| URL | Page |
|-----|------|
| `index.html` | opens the hub (redirects to `#/us/job-city-tracker`) |
| `index.html#/us/job-city-tracker` | hub: hero, explorer (ranking list + world map), key findings, FAQ |
| `index.html#/us/job-city-tracker/london` | city page — also `new-york`, `sao-paulo`, `metro-manila`, … (46 in total) |

Also hosted (same build): <https://landing-page-prototypes-a8ffbc.gitlab.io/job-city-tracker/>

## What is in the folder

| Path | Contents |
|------|----------|
| `index.html` | the page **and** the whole app: the built JavaScript is embedded as one inline module (~11.6 MB) |
| `css/app.css` | every stylesheet of the build, concatenated (tokens, fonts, Tailwind, design system, component styles) |
| `js/offline.js` | the world map (Natural Earth 1:50m topojson) inlined, plus the shim described below |
| `fonts/`, `images/` | Right Grotesk 500, Inter 400/500, and the two logos header and footer use |

Everything else — the 46 cities' numbers, the flags, all icons — is already inside `index.html`.

## Why it is built this way

Three things stop a normal Nuxt export from opening by double-click, and each has a fix here:

1. **Module scripts are blocked over `file://`** (origin `null`). Browsers refuse to *load* a
   module file, but an inline `<script type="module">` fetches nothing — so the built chunks are
   bundled into one module and embedded in the HTML.
2. **`fetch()` cannot read `file://` URLs.** The map's topojson would fail, so it ships as a global
   in `js/offline.js`, where a small shim answers the app's request for it. The same shim answers
   every JobLeads API call with an empty object: unanswered calls make the app jump to
   `/maintenance.html`, and the prototype needs no backend anyway.
3. **A history-mode router reads the file path** under `file://` and lands on the 404 page — hence
   the `#` URLs.

## Updating it after a feedback round

In the Nuxt PoC repo (`jobleads-poc-20260723`) — the prototype's source of truth:

```bash
rm -rf .output
STATIC_EXPORT=1 STATIC_BUNDLE=1 NUXT_APP_BASE_URL=./ npx nuxi generate
python3 tools/bundle-export.py .output/public "<this folder>"
```

`tools/bundle-export.py` does the bundling, the CSS concatenation, the inlining of the map, the
asset copying and the HTML rewrite. (An earlier variant with real per-route URLs
(`/us/job-city-tracker/london/`), which needs a web server, sits in `../_archive/`.)

## Known limits

- The page renders in the browser, so "view source" shows the app, not readable page markup. If
  someone needs static HTML per page, that is a different artifact (a hand-written mirror like
  `des-148_resume-matches-lp/…/resume-matches-v1-nuxt`).
- **Only the tracker's routes are built in.** Header and footer are the app's real components, but
  every other page of the app was dropped from the build, so their links show the app's own 404
  page. That is deliberate: it keeps the bundle to the pages this prototype is about.
- Login, search and shop are absent by design. What does work: the quarter dropdown, the industry
  filter, city search, map zoom (buttons, double click, ctrl/cmd + wheel, pinch) and pan, the
  highlighting in both directions (hovering a row moves the zoomed map to that city; hovering a dot
  marks its row and scrolls the list to it), and on phones the bottom-sheet preview a tap on a dot or
  a country opens — which stays open while the map keeps working.
- Every page is `noindex`.
