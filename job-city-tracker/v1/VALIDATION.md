# Validation — JCT preview, 4 September 2026

This records the separately built offline and hosted artifacts, not a production release or comprehensive design-system/accessibility certification. Runtime files were frozen before the final runs; documentation and SHA256SUMS were added afterwards.

## Completed checks

| Check | Result |
| --- | --- |
| Focused Nuxt feature/configuration tests | 188/188 passed across 22 files |
| Preview packer tests | 13 passed, including guard refusals, asset embedding and final-manifest cleanup order |
| Scoped ESLint | Eight changed TS files checked; zero errors or warnings after explicitly including the two default-ignored test files |
| Actual offline Chrome matrix | 165/165 passed, including 100 distinct direct city loads |
| Actual route-folder Chrome matrix | 165/165 passed, including 100 distinct direct city loads under the exact deployment subpath |
| Plain entry and reload | Passed in both formats |
| Existing language control | Desktop English option and mobile single-language state passed; hosted mode also passed with existing German cookies |
| Actual downloads | Six PNG and six CSV downloads per artifact: Volume, Company and Close in Full desktop and Launch mobile |
| Assets and runtime | Zero page exceptions, console errors, failed local requests, 404s or external/backend request attempts in the final runs |
| Source/build binding | Isolated build source matches final app/config/tool source; source fingerprint in RELEASE.json |
| Structural review | All 104 HTML files protected; web820/offline12 permitted runtime asset paths exist |

The matrix covers Full/Launch at390 and1440px, map geometry/keyboard/zoom, city search and shared column widths, filters, tooltips, chart tables, panels, route navigation/reload/back and downloads. City Volume/Growth/Days active retain eight quarters; Jobs per company retains five. PNGs were decoded and checked for visible content; CSV values were compared with the accessible tables. Representative actual screenshots and PNGs were also visually inspected.

Independent final scans check known private configuration values, public bypass settings, private filesystem paths, sensitive filenames, symlinks, source maps, CSP and noindex. SHA256SUMS identifies every packaged file except the checksum list itself. The offline ZIP is separately test-extracted and compared byte-for-byte before delivery.

## Explicit limits

- Chrome on macOS is the tested browser, including mobile viewport simulation. This is not physical iOS/Android/Safari/Firefox certification.
- The 100-city smoke covers every city once per format, alternating Full/Launch. Detailed two-variant behavior and downloads are covered on New York; every chart export for every city is not exhaustively tested.
- Clipboard image permissions, live authentication, backend data/search, translations and intentionally unfinished links are not release-tested production features.
- Background services are disabled for this preview. Deliberate outbound links can still leave it. English is the sole packaged language.
- Source-wide strict typecheck, previously documented accessibility exceptions, accepted contrast/dropdowns, data claims and country-scoped routing remain separate handoff issues.
- Existing build sourcemap/chunk warnings and a Python escape deprecation warning remain recorded; generated source maps are excluded from the package.
- Replacing the active export does not revoke the historical exposed bypass value or erase old copies/Git history; its owner must revoke/rotate it.

Raw evidence is retained privately in the source handoff audit directory. Earlier failed attempts are preserved; only the final runs above establish this artifact acceptance. GitHub deployment/live verification is recorded separately after publishing and cannot be inferred from this pre-deployment note.
