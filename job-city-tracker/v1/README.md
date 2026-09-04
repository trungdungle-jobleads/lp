# Job City Tracker — hosted preview

Export: 4 September 2026. Launch and Full are included. See `RELEASE.json` for the source fingerprint and build identity.

Launch: https://trungdungle-jobleads.github.io/lp/job-city-tracker/v1/us/job-city-tracker/

Full: https://trungdungle-jobleads.github.io/lp/job-city-tracker/v1/us/job-city-tracker/?variant=full

This is a client-rendered Nuxt static build with separate route folders for Main and all 100 cities. It requires HTTP hosting; it does not open by double-click. For offline use, use the separately generated `static` folder. The root entry preserves legacy hash-link forwarding.

## Deployment contract

- Repository: `trungdungle-jobleads/lp`
- Branch: `main`; GitHub Pages publishes from the repository root.
- Replace only `job-city-tracker/v1/` with this entire reviewed folder.
- Required build base: `/lp/job-city-tracker/v1/`. Moving it to another path requires a rebuild.
- Do not include the sibling offline folder, ZIP archives, backups or other private material.

Both formats have fixed safe public configuration, no backend bypass value and a preview-only background-network boundary. Packaged assets may load; background APIs receive empty demo responses. Login, production job search and unfinished Full topic links are not implemented. Existing outbound navigation links are deliberately retained.

Data includes prototype snapshots and synthetic demo values. This is not a production-data, complete design-system or accessibility approval. `noindex` is not access control: GitHub Pages is public.

Only English is packaged. The existing header shows EN with one English option; the mobile language panel has no alternate language.

## Safe updates

Edit the Nuxt source, generate with an allowlisted environment in an isolated copy, pack into a fresh folder, scan every final file and test actual route loads, interactions and PNG/CSV downloads. Publish only the tested bytes. Keep source/build identity and file hashes with each release.

Historical exports contained a backend bypass value. Its owner must revoke/rotate it; replacing this directory does not erase historical copies. Do not roll back by republishing a credential-bearing old export.

## Flag export correction

This refreshed build loads PNG flags from the same lazy country asset resolver as the UI. Search results no longer determine which flag artwork can be exported. No chart design, data, filters, CSV formatting, citation wording or dropdown behavior was changed. See VALIDATION.md for the checks specific to this update.
