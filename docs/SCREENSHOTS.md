# Game screenshots

Screenshots show actual native buildings rendered by the game. A capture is
evidence of their appearance; it does not prove an entire simulation feature is
complete. No book illustrations or generated concept artwork are used.

## Current castle capture — 11 October 2026

`assets/screenshots/castle-1200.png` shows Rougecastel's existing stone keep and
completed hill curtain in AD 1200, closed simulation day 150, land seed 1001,
fate 42, sea coast, 6 km map. This is a tower castle; it has no completed hall or
chapel in the selected checkpoint. The image comes from the current working
build and is separate from the earlier AD 1068 motte-and-bailey screenshot.

Production source: `99f14a55b230d5b933f29ee3404bb0372cde8db9`.
HTML SHA256: `7aeb74e34ba6d54ac414df12ee60fc44079b9b67537486f07ec2fdc4653d599f`.
Game script SHA256: `a985ada765e6f339ffabab500c4ed0969a606e90fb03daf0e8b925720408b109`.
Native checkpoint SHA256: `a7b40eeb83f67bab7749f37e638f8979e8f2c3437c8561e2c354157b43e6d68d`.

The native export loads that checkpoint without generation, ticks, commands or
placement, resaves it byte-for-byte, and verifies the complete authoritative
graph and every RNG stream across component selection, bootstrap projection and
actual citizen/herd projection. The disposable browser scene uses those native
views and the unchanged game rendering functions. The draw check verifies the
actual keep instance and 1,414 built wall vertices in the view, all textures
ready, and zero texture or browser-console errors.

This observational profile does not initialize lazy titles or query inspectors.
It makes no individual-title or payment claim. Two stricter, unsuccessful export
attempts remain separate failure evidence; the appearance capture does not
replace those tests. The three image assets retain their native repository
bytes. Software-rendered Chrome supplies this capture, not a Safari performance
measurement.

Native export: 29.749730 CPU seconds, load 0.04 to 0.69. Browser wrapper:
2.526605 child CPU / 28.406315 wall seconds, load 0.6973 to 1.7236; Chrome
grandchildren may be excluded from that CPU accounting. These figures do not
measure simulation throughput.

The ignored evidence directory is
`tools/soak-results/current-castle-draw-20261011` in the isolated government
institutions checkout. Native export harness SHA256:
`2a619484de68ab176ea925454c03b1e9b4b8b5b5a4d967cb0a387fa359b26894`.
Draw harness SHA256:
`7daa90ee62891d93f18827bf030a63997276809699004fc198b40571f475e714`.

## Earlier town capture

`assets/screenshots/town-1068.png` shows Vadoreal's bridge, riverside streets and
church in AD 1068, land seed 42 and fate 42. It remains an earlier running-world
capture, not a picture of the newly implemented connected Abbey ranges.

A fresh simulated completed Abbey compound capture remains pending. The earlier
`docs/images/abbey-church-ad1201.png` shows only a church from an older source;
it is not evidence of a completed current Abbey, residence, grange or cloister.

## Current Abbey layout preview — 11 October 2026

`assets/screenshots/abbey-layout-preview.png` is a newly rendered illustrative
completed layout, explicitly captioned as a preview. It uses the same frozen
game script as the current castle capture, with the unchanged
`abbeyConnectedSpec`, `compoundLayoutPoses`, `compoundLayoutRoute`,
`compoundCourtGeometry`, `projectBuildingInstance`, `drawChurch` and
`drawCompoundCourt` functions. Five local room fixtures and a cloister occupy
a separate disposable scene group. They are never added to native world or
projected building records.

The existing pure day150 ground/season and actor DTOs initialize the normal
native display frame; the surrounding native town and actor meshes are hidden.
No world is generated, loaded, stepped or commanded for this preview. It makes
no simulated completion, title, payment, housing, industry or Abbey actor claim.
The underlying church, residence, grange, chapter house, refectory and roofed
courtyard geometry is from the current renderer, not generated concept art.

Both views verify every room body in view and the exact instance matrices,
colours and material attributes for all 64 cloister piers and four roof parts.
The suppressed central body/roof is excluded from positive visibility evidence.
Textures are ready and browser/texture errors are zero. Correct native display
initialization applies the current lighting and shadows; the earlier distant,
unlit preview and the failed incomplete lighting setup remain separate evidence.

Preview harness SHA256:
`23a5794ab7bb2f232f420f389346605664842106e6205ea1bb6bd323819812f9`.
Wrapper CPU `1.543634` / wall `11.296498` seconds, load
`0.027344→0.859375`, RSS `229332` KB; Chrome descendants may be excluded.
These are capture costs, not simulation throughput. Current and earlier results
remain in the ignored government-institutions capture folder.
