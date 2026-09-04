# Validation — refreshed prototype exports

4 September 2026 · Source revision `e0d344a37`. No source, design, dropdown, routing or data changes were made in this refresh.

## Verified

- Fresh isolated Web, Offline and Launch-only builds passed, using the existing installed dependencies and an allowlisted environment.
- Web and Offline: Full + Launch at 1440px and 390px; Main plus all eight cards in New York and London. All four card actions were exercised: PNG download, CSV download, Copy image and Copy citation.
- Main filters, zoom, searches, no-results and Methodology CSVs passed. PNGs retain all 100 city rows and flag artworks even when the visible list is empty, including before the first export in a fresh browser context.
- Across the two shared previews and separate Launch-only preview: 1,076 passing recorded cases and 460 PNG download/copy payloads. No recorded page, console, asset or network failures.
- The Launch-only preview passed navigation, reload and forced-Full guards. It keeps eight quarters for Volume/Growth/Days active and five for Jobs per company.
- Actual PNGs from all eight card types and the Main ranking were visually reviewed. Automated checks compare data, labels, layout bounds, filenames and citation URLs.
- Final files are scanned for known sensitive values, credential patterns, private paths and source maps. Preview configuration, CSP, early network boundary and exact packaged-asset allowlists are checked. Archives are test-extracted and byte-compared.

Source tests on this same revision passed in the preceding verification: 706 tests across 74 files. This refresh did not repeat a private-registry dependency installation.

## Boundaries

These are prototype checks, not production-data, complete design-system, accessibility or universal browser approval. The 100 city routes were generated; the all-card interaction matrix uses New York and London, not every city/filter permutation.

Clipboard payloads use an isolated browser adapter; native operating-system permissions and pasting are not covered. The previously documented combined Jobs-pane/scroll/chart-menu dismissal caveat is not repaired by this refresh.

Accepted demo-data assumptions, missing-reference comparisons, compact Main CSV counts, salary CSV/citation footnote limitations, contrast and unfinished links remain unchanged. Runtime files were frozen during QA; only release documentation and checksums were added afterwards. Publication and post-deployment checks are recorded separately.
