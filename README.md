# JobLeads — Design Prototypes

Static HTML prototypes, published via GitHub Pages. No build step, no server — each prototype is self-contained (its own `assets/` + `fonts/`).

## Structure

Each prototype lives under `<page>/<version>/`:

```
resume-matches/
  v1/            → Resume Matches landing page (DES-148)
job-city-tracker/
  v1/            → Job City Tracker microsite (DES-160) — hub + 46 city pages in one file
```

- **New version** of the same page → add `resume-matches/v2/`, `v3/`, …
- **New page** → add a sibling folder, e.g. `resume-review/v1/`

Because every prototype uses only **relative** asset paths, it works at any depth without changes.

## URLs

After enabling GitHub Pages, each prototype is reachable at:

```
https://<user>.github.io/<repo>/resume-matches/v1/
```

The Job City Tracker is one HTML file holding every page, so its routes live behind the `#`:

```
…/job-city-tracker/v1/#/us/job-city-tracker                                  the hub
…/job-city-tracker/v1/#/data-hub/job-market/united-states/texas/houston      a city
…/job-city-tracker/v1/#/data-hub/job-market/…/houston?industry=Finance       with a filter applied
```

Everything after the `#` is a fragment, so no server ever sees it — the same file also opens by double-click
from a local folder.

## Notes

- `.nojekyll` (repo root) tells GitHub Pages to serve the files as-is (no Jekyll).
- Every prototype carries `<meta name="robots" content="noindex, nofollow">` — kept out of search results. **GitHub Pages is still public**, though: anyone with the URL can open it.
- For social link-preview cards, set each page's `og:image` to its absolute URL (e.g. `https://<user>.github.io/<repo>/resume-matches/v1/assets/og-resume-matches.png`).
