# Job City Tracker — hosted build (DES-160)

Open <https://trungdungle-jobleads.github.io/lp/job-city-tracker/v1/us/job-city-tracker/>. Links that
still carry the old `#`-URLs keep working: the entry page translates them into the real path.

This folder is the **hosted** variant. It is the real Nuxt app with one HTML file per page and its
code split into route chunks, so a page loads what it needs and nothing else. That is why it is
fast — and why it needs a web server: opened by double-click it cannot boot, because browsers refuse
to load ES modules over `file://`.

**To send the prototype around, use the single-file build instead.** It lives in the ticket folder
under `02_work/html/static` and opens by double-click; every page sits behind a `#`-URL there.

| Path | Contents |
|------|----------|
| `us/job-city-tracker/` | the hub: hero, explorer with ranking list and world map, key findings, FAQ |
| `data-hub/job-market/<country>/<region>/<city>/` | the 100 city pages, e.g. `united-kingdom/england/london/` |
| `assets/` | the build's JavaScript and stylesheets, hashed |
| `css/`, `fonts/`, `images/` | the font sheet, Right Grotesk 500, Inter 400/500, the two logos |
| `index.html` | forwards to the hub, and translates an old `#`-URL into its page |

## What was left out

The export drops what no data hub page uses: the six translated dictionaries (the prototype is
English only, and English is rendered from the keys), error reporting, the illustrations that ride
along through the import graph, the duplicated base64 fonts, and the stylesheet rules whose class
names appear nowhere in the application. None of this is removed from the app itself — it happens in
the export tooling, after the build.

## Known limits

- Only the tracker's routes are built. Header and footer are the app's real components, but every
  other link lands on the app's own 404 page.
- Login, search and shop are absent by design. What does work: the quarter dropdown, the industry
  filter, city search, map zoom and pan, the highlighting in both directions, the shortened colour
  scale that expands on a tap, and on phones the bottom-sheet preview.
- Every page is `noindex`.
