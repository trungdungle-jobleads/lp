# Validation — search-independent PNG flags

Updated 4 September 2026. Both Full and Launch are included. This is a refreshed prototype, not a production or universal browser/accessibility release. Runtime files were frozen before QA; only this documentation, release metadata and checksums were added afterwards.

## Verified in this update

- 200/200 JCT tests across23 files;25 focused asset/export/golden cases pass. All existing Canvas goldens unchanged. Five source/test files pass explicit lint.
- Both isolated clean-environment builds and existing packers succeeded. The build copies match the canonical source; only five source/test files changed from the verified pre-fix checkpoint.
- Main: offline and strict hosted route output, Full/Launch,1440/390px, All industries/Q1 2026 and Finance/Q3 2025, unfiltered/New York/London/no-results states. All128 real PNG download/copy payloads retain100 flags and100 correctly ordered rows with the same flag identities as the unfiltered baseline.192 recorded Main checks pass.
- City: both output modes, Full desktop and Launch mobile, all8 cards with actual PNG and CSV downloads;100 recorded checks pass, including flags/header assets and fonts.
- Candidate runs have zero reported page/console/network/static-asset errors. Unexpected backend/external requests are blocked and treated as failures.
- Root visually reviewed actual searched Main PNGs, including the previously missing non-US flags.
- Final files scanned for sensitive/private values, source maps, filesystem paths, symlinks, unsafe config and missing preview protections. SHA256SUMS describes every other packaged file. The offline ZIP is test-extracted and byte-compared.

## Preserved scope and limits

Only PNG flag asset resolution changed. Compact Main CSV numbers, Salary CSV/citation footnote omissions, ambiguous Growth scope labels, missing-national Seniority comparisons, absent Industry cards for four cities, accepted contrast and unfinished links remain as documented. The prior Full-desktop combined scroll/menu-dismissal case is not corrected or retested here.

Clipboard checks capture image payloads in an isolated browser adapter; native OS clipboard permissions/pasting remain untested. Chrome desktop/mobile viewports are covered, not every physical device/browser or every city/filter permutation. All100 routes were generated but were not each reopened in this narrow regression. Earlier broader route and all-card audits are historical supporting evidence, not reruns of this candidate. Source-wide strict typecheck and backend/real-data correctness remain outside this release.

No app renderer geometry, stylesheet, snapshot, route, packer or menu implementation changed. Ordinary build warnings remain in private build logs. Deployment status and post-publication verification are recorded separately after publishing.

Audit-only assertion correction: the first City run required every declared font, including unused fallback and unrelated families, to load. All PNG/CSV/menu checks passed. Final City evidence combines48 original passing checks per format with2 fresh actual-font/asset checks, bound to the preserved raw result hashes. It does not claim a full50-case rerun. No runtime change was made for this correction.
