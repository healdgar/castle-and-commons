# Rendering and woodland review — 13 October 2026

This records the original rendering assessment, followed by the grown woodland
integration trial below. Unfinished work is tracked only in [ISSUES.md](ISSUES.md),
under #104–106. The original review was read-only; the trial changes presentation.

## Grown woodland integration trial

**Menu → Preview grown trees** selects the seven native Forestmodeler specimens
in the current realm. **Use original trees** reverses the display immediately.
The URL's `?woodland=1` selects the trial on opening; the default still uses the
original palette. Source species are retained in the manifest: these are North
American genomes, not newly authored medieval European trees. The generator
and its engine stay in Forestmodeler; only finished meshes, PNGs and provenance
are imported into `assets/woodland/`.

The release page now embeds the woodland renderer, all fourteen tier meshes,
fourteen foliage textures and three directional atlases. Selecting the preview
requires no external woodland requests. This repairs the missing-asset failure
of an HTML-only host (`Woodland HTTP 404: library.json`) and removes the same
dependency from file opening and sandboxed previews. The original trial's
complete local asset server hid that publication gap. Three.js still uses the
existing CDN, and the other game textures retain their existing asset paths.
Run `node tools/embed-woodland.mjs` after changing the renderer or imported
assets; `tools/stamp.sh` also regenerates it. The regression check verifies the
embedded renderer and every runtime file against their sources, byte for byte.

Both current WebGL2 and forced-WebGL1 checks load all seven specimens in an
opaque sandbox with fetch disabled, then pass eleven native worker views with
every external woodland request rejected. The game program remains exactly the
previously verified 150-day candidate, so its native save/RNG proof is reused by
source equality rather than rerunning identical simulation code. Evidence is in
`/workspace/furlong-woodland-loading/`. Direct file navigation is blocked by this
cloud browser policy and is not claimed as an executed scenario.
Architecture and equivalence fixtures now select the game program through the
existing `inlineGameScript` helper, avoiding the embedded library's separate
strict directive and helper names. Their model assertions and source pins stay
unchanged.

The full batch finishes with 2,296 passes and seven source-reader failures;
all 152 targeted rechecks pass after selecting the correct program, verifying
2,308 distinct checks overall. Full-batch cost is 3,902.619 process CPU seconds,
load3.40→1.01; rechecks use 211.253 CPU seconds, load1.09→2.10. This includes
the unchanged native layout/save/economy assertions; it is not a runtime speed
measurement. Automatic `?woodland=1` startup also passes on the stamped
page served beneath `/castle-and-commons/`: all 57,320 native instances, linked
shaders, no GL/page errors and no external woodland requests. Detailed logs
and receipts are in the loading evidence directory.

Native placement, per-tree variation, land clearing and the ground feature mask
are reused. Display height is normalized to the old tree categories by uniform
scaling; it is not a biological growth or age claim. Variant selection uses the
existing coordinate hash, without consuming a simulation RNG. Original and
grown displays synchronize visibility and instance transforms when switched.

The directional colour/normal/16-bit-depth atlases share three 2048×1024 PNGs.
Packing copies native pixels verbatim, so a variant does not require another
far draw call. Far trees use two triangles and spatial instance batches. Near
and middle pools are capped globally at 256/2,048 trees, with source geometry
budgets of 500/64 triangles. Screen-size bands blend the representations with
ordered coverage; camera changes rebucket at most every 150ms and an unchanged
view does no rebucketing. Clearing invalidates the buckets immediately.

The main light's shadow caster uses a fixed light-facing directional sample and
the native baked depth, independently of the player's camera and beauty tier.
Near/middle meshes receive shadows but share that caster. The existing PCF,
snapped coverage, 1,600m cutoff and night lighting remain; this does not close
#105. Regrowing saplings also retain the original representation.

The first captures show more silhouette variation and actual winter branches,
but coarse leaf cards remain plainly angular at extreme close range, especially
for conifers. The 48px impostors are intended for small screen footprints, not
close inspection. This is an opt-in visual trial, not accepted final art or a
hardware performance claim.

The 150-day native comparison preserves complete save bytes, every RNG and
private stamp at days0/50/100/150, and every byte of 1,812 raw outcome rows
(seed1001/fate42, AD1066, sea). A 30-day seed2002 inland pair also matches,
including all 465 rows, with clean money, inventory and fault audits. The paired
gate uses 501.703 process CPU seconds, load2.01→1.34. All 2,306 full regression
checks pass in one batch: 3,902.653 CPU seconds, load1.34→1.00. These gate costs
are verification overhead, not a rendering benchmark. Detailed evidence and
matched source snapshots are in `/workspace/furlong-woodland-trial/`.

Final WebGL2 and forced-WebGL1 runs each pass 11 views with no page/shader
errors, intact instance visibility across switching, clearing/restoration, and
restoration of a tree hidden before loading the preview. The winter shadow map
retains SHA256 `dffab0dd410657cb30c7b2fd7f2586a4792e8472e58882b3532581f8111a646d`
across camera bearings0.6/2.1 in both backends. The matched realm view submits
1,809,759 triangles in79 main-pass draws against the original3,072,113/100.
Close views can increase draw calls; counts exclude shadow work. No phone,
Safari or hardware throughput acceptance is claimed. Local browser evidence
is in `final-desktop/` and `final-webgl1/` under the evidence directory.

The game trial is pushed to `main` in [a90fa06](https://github.com/healdgar/castle-and-commons/commit/a90fa06e820af763e109253910271fec69fecaec).
That push triggers Pages/container publication. This cloud session’s HTTP proxy
rejects the Actions API and Pages host, so no live deployment or container
receipt is claimed here; external parity remains #84.

To import another complete native export into a fresh destination, run
`node tools/import-woodland.mjs SOURCE DEST`. The import checks native file
receipts and tier ceilings. Atlas packing needs Python/Pillow offline; set
`WOODLAND_PYTHON` to Forestmodeler's `.venv/bin/python` when needed. Runtime and
normal game serving require no Python, Pillow or Forestmodeler code.

The optional `tools/woodland-play-check.py --out FRESH_DIRECTORY` capture needs
Python Playwright and Chrome/Chromium. It opens the actual worker build, pauses
the native realm, clicks the preview control, captures matched summer/winter/map
views and verifies switching, display clearing and fixed winter shadows. Pass
`--webgl1` to exercise r128’s fallback without changing the shipped game.
Pass `--standalone` to reject every external woodland request and first check
loading in an opaque sandboxed frame with all fetch calls disabled.

## Conifer crowns with 3D shapes and depth detail

The conifer foreground export compressed roughly 98,000–179,000 needles into
one large card while the painted texture capped the count at 160 enlarged
blades. This made opaque green sheets. The four fir/larch individuals now use
fixed enclosing volumes with the actual grown wood: 36 crown triangles nearby
and 12 at middle distance. Combined wood/crown costs remain within 500/64.
One middle wood companion is reduced with measured maximum displacement of
0.04136 m; the original native wood export is retained.

Forestmodeler's independent compiler reconstructs every exported depth view
and season, then fits conservative support planes. It never alters growth or
imports the game engine. The game traces a perspective ray through those shapes
and reconstructs colour, normals and fragment depth from the nearby baked
views. Invalid projections are rejected; shadows are sampled at reconstructed
surfaces. Conifer PNGs are decoded from their declared sRGB colour before
lighting, consistently in the far representation. Oak/birch retain their
existing meshes, source pixels and palette.

Conifer directional tiles are rebaked at 124 px, retaining the same skeleton
fingerprints. Mixed-resolution atlases copy all 21 native banks verbatim into
three 2048×2560 PNGs. These consume 60 MiB uncompressed rather than 96 MiB with
uniform 1024 px banks; the previous all 48 px set consumed 24 MiB. This is a texture
memory cost, not a claimed speed improvement. Near/middle instance caps,
clearing and the independent fixed light caster are retained.

Both WebGL2 and forced-WebGL1 pass 21 worker views with no page/GL errors and
external woodland requests blocked. All four individuals are captured in
summer/winter, with additional eye-level/reverse views. Switching preserves
all 57,320 instances; conifer clearing/restoration retains native transforms;
winter shadow-camera invariance also passes. The 17 native asset/volume checks
pass. All 2,309 full regression checks pass (3,895.006 process CPU seconds, load2.84→1.00). The authoring checks use20.048 CPU seconds, load3.48→2.84. These are verification costs, not rendering throughput claims. Source equality reuses the prior
150-day full-world/RNG proof: the game program is byte-identical. Evidence is
in `/workspace/furlong-conifer-fix/`. The independent compiler is published in [fb6173c](https://github.com/healdgar/forestmodeler/commit/fb6173c).

Close detail remains limited by the baked resolution; mobile/hardware art and
throughput acceptance are open under #104. Regrowing saplings retain the original
representation. The assets remain correctly labelled North American genomes.

## Original review evidence

Current Furlong source: `075d97e09e3f4f96a9593ab59d1f3ce340d12b6e`;
HTML SHA256 `c77c0501f0852dd7cf3a80415c034765c8e946b8d7f1efe75f7e47ec285e91c1`.
An isolated Chromium/SwiftShader capture uses the actual default worker build,
seed1001/fate42, AD1066, sea coast, 9km. It pauses on day 0, disables automatic
RAF, and changes only the disposable camera/season display. Both material
images load, all eight views link their shaders, GL errors are zero and there
are no page exceptions. The final projected day remains 0. This is appearance
evidence, not a complete world/RNG identity proof or a hardware speed benchmark.

The native screenshots, capture script and JSON measurements are in
`/workspace/furlong-render-review/`, outside the checkout. The capture report
there embeds the exact inspected screenshots. No generated concept images
stand in for the game.

| Step | Captures | Health / finding |
|---|---|---|
| 1 | 01 broadleaf close, 02 reverse bearing | Needs improvement: solid polygon crowns, repeated flat leaf wallpaper and little internal structure from either bearing. |
| 2 | 03 conifer close | Needs improvement: repeated paired-cone silhouette, dark foliage and solid triangular shadows. |
| 3 | 04 broadleaf winter | Needs improvement: flat repeated branch silhouettes and curved/distorted ground shadows; the shader is view-dependent. |
| 4 | 05 town textures | Generally coherent: metre-scale paving, timber/stone and roofs read clearly. Repeated black window patches have no interior depth; some slate highlights are strong. |
| 5 | 06 distance 1590, 07 distance 1610 | Confirmed discontinuity: all sun shadows turn off across the 1600 m camera-distance threshold. |
| 6 | 08 realm overview | Landscape remains legible, but it submits 3.07 million triangles even at map scale. Distant tree silhouettes need a cheaper representation. |

The browser wrapper records 0.199162 child CPU seconds and 102.496288 wall
seconds, load 0.00→2.78. Its CPU accounting excludes Chrome descendants and
must not be interpreted as total rendering cost. SwiftShader frame rates do
not describe the user's GPU. Water closeups, moving-light stability, nighttime,
mobile/Safari and keyboard/screen-reader behavior were not audited here.
Dense foliage and abrupt loss of building shadows can make silhouettes harder
to distinguish; screenshots do not establish accessibility compliance.

## What the renderer already does well

`initGraphics` limits pixel count, uses a single 2048² PCF sun map, and moves
its shadow coverage around the camera focus. Shadow origin snapping and bias
expressed in world metres are sensible. These controls should be retained.

`initMiniatureMaterials` and `miniatureSample` provide a small shared 512² atlas,
explicit mipmaps, independent material-cell sampling, anisotropic filtering,
derivatives and distance fading. The landscape does not need larger textures
everywhere. The repeat painted onto a solid canopy is the principal woodland
problem; a sharper leaf image would retain the same solid silhouette.

`buildTrees` uses 65 occupied species/chunk batches in this world, with rotation,
stretch and colour variation. There are three base geometries, at28–32 triangles
per tree. All 58,320 slots together represent 1,732,990 tree triangles, including
slots that may currently be hidden by zero scale. Chunks span roughly 2.52km at
9km map size. They are culled as units; they have no distance LOD.

The close town view submits 2,108,100 triangles in 58 main-pass draws; the realm
view submits 3,072,113 in 100. These are `renderer.info.render` readings, not a
claim that every triangle appears on screen. Three.js r128 resets these counters
AFTER its shadow render, so the shadow pass is additional uncounted work.
Instancing helps draw-call overhead but does not remove vertex or fragment cost.

## Shadows

`animateWorld` switches `G.sun.castShadow` at `cam.cur.dist<1600`. The two
captured distances show the visual loss. Fade shadow contribution before turning
off the map; retain the budget rather than extending full shadows across the realm.

At close range shadow texels are 0.078–0.094m; near the cutoff they become 1.172m.
Increase map resolution only after profiling. Smaller coverage, simpler distant
casters and stable quality transitions are better first controls.

`treeBranchShader` supplies both the winter beauty shader and its custom depth
shader with `uSurfaceEye`. The branch geometry is a pattern on a crown shell
built around the player's viewing direction. Sharing its discard with the depth
shader makes the shadow correspond to that view-dependent shell, rather than a
fixed three-dimensional skeleton. A baked skeleton or stable light-facing
impostor depth is preferable. The winter capture supports the appearance concern;
camera-only shadow motion has not yet been measured.

Source inspection also finds a nighttime risk: `daylight` has a 0.14 minimum,
so its `>0.05` shadow condition never disables a below-horizon sun. Verify night
lighting separately; readable ambient fill should not require sunlight from below
the ground. No nighttime visual failure is claimed from these daytime captures.

## Forestmodeler feasibility

The user supplied [healdgar/forestmodeler](https://github.com/healdgar/forestmodeler).
It was cloned to `/workspace/forestmodeler`; inspected commit
`6a5aae86e2b0f20977782e597b2a72b3a095c2fb`. Its `ColonizingGrower` produces
seeded individuals from genomes, a reusable skeleton, multiple mesh tiers,
GLB meshes and version 5 growth records. Leaf and bark texture bake scripts
already exist. These are useful source assets and authoring machinery.

It is not a ready whole-map replacement. Current `lod.py` permits 150,000
triangles for `game`, 60,000 for `far` and 20,000 for `impostor`. The latter
still meshes a coarse plant; its own code/docs say true multi-angle impostor
baking is not built. The older numerical tier table in `docs/GAME.md` is not a
measurement of these current limits. GLB export splits bark and foliage, supplies
UVs and alpha-mask materials, but embeds no textures.

A fresh native 20-year/seed 42 export at its lowest tier gives:

| Sample | Export | Decision |
|---|---|---|
| Northern red oak | 2,770 triangles: 2,586 shoot, 132 roots, 52 foliage; 97,000-byte GLB; 26 cards; 7.09 m living height | Useful source candidate, too expensive as every Furlong tree. |
| Balsam fir | 435 triangles: 165 shoot, 270 roots, zero foliage; 16,460-byte GLB; 0.69 m living height | Reject as a conifer asset: no crown. This does not diagnose the biological cause or establish a species-wide failure. |

The probe uses unmodified native genomes and `scene.plant_meshes` through
`export_plant`, including roots. Both native trees have living nodes. Process
CPU 30.165459s / wall 30.293529s, load 0.46→0.68, including growth and exports.
No mature multi-seed library, reduction fidelity or impostor output is validated
by this small probe.

The available genomes are New England species: red oak, American chestnut,
red maple, balsam fir, tamarack, gray birch, highbush blueberry and American elm.
They can prove the technical pipeline. Medieval European assets need appropriate
genomes rather than relabelling North American species. The engine's rule is
that species definitions belong in `plan.py`, not renderer special cases.

## Proposed asset contract

Grow a small reusable library offline. For an initial architecture test, two
broadleaf forms and two conifer forms with three seeded individuals each are
enough to test variety and batching. A final regional palette could include
oak, beech/birch, Scots pine and spruce/fir where appropriate. Final species
selection and genomes need regional evidence. Saplings and mature forms can
share the same source skeleton; do not run Python growth inside Furlong.

Each asset should ship metre-scale bounds and a ground pivot, a stable winter
wood mesh, separable seasonal foliage, a few tiny near/middle geometries, and a
baked directional atlas. These provisional runtime ceilings are a starting
budget, not measured accepted quality:

| Screen size | Representation | Provisional triangles / tree |
|---|---|---|
| Large nearby silhouette | Simplified trunk/major branches with a few canopy lobes or alpha-tested foliage clusters | 200–500, used only for a bounded nearby set |
| Middle distance | Simplified lobes/branch cards | 24–64 |
| Small distant silhouette | Multi-angle impostor | 2–4 |

Choose tiers by projected pixel size, with hysteresis and a short stable dither
transition. Keep the distant tier in spatial instance batches. A new variant
must not mean one draw call or one JavaScript object per tree. Tune chunk size
against measured culling, draw count and rebuild cost rather than multiplying
the present 65 batches by every species/individual/tier.

A canopy atlas should carry alpha/albedo and, if the measurement justifies it,
normal and depth. Bake several azimuth AND elevation views, including steep
map views. Reproject/blend the nearby directional samples using depth so leaves
at the front obscure leaves behind. This creates apparent internal depth as
the camera moves. It is the right texture trick for an entire distant tree.
A small parallax texture on today's opaque crown only moves the wallpaper;
it does not create branch gaps or a natural crown outline.

Use alpha testing and depth writing for foliage, with padded atlas tiles and
coverage-preserving mipmaps. Avoid sorting thousands of transparent crowns.
Billboards still have overdraw and shader costs: fewer triangles alone do not
establish a faster renderer. Shadow baking must use a stable light-facing view
or simple wood/canopy proxy, independent of the player's view.

For buildings, the related technique is interior mapping: transform the
view ray into the wall/window's local frame, intersect a shallow virtual room,
and sample its back/side surfaces. Restrict it to actual visible window openings;
retain plain dark patches once windows are only a few pixels wide. Medieval
unglazed/shuttered openings should not all become modern glass. This is optional
polish after woodland cost and shadows, not a reason to add rooms to simulation.

## Integration and acceptance

Convert Forestmodeler's Z-up `(x,y,z)` to Furlong's Y-up `(x,z,-y)` in the
offline adapter, including normals. Its GLB material factors are linearized
from sRGB genomes; Furlong's custom atlas/tint shaders use their own existing
conventions. Normalize them once in the adapter and check a known colour,
rather than multiplying imported base colour by another species tint.

Use a versioned asset manifest and preconverted compact geometry/atlas files;
Furlong does not currently load GLTF. Loading full growth records, hidden roots
or the full research plant for every map tree would add unnecessary runtime
work. Preserve source provenance, height, crown dimensions, seasonal metadata,
and reduction/bake settings so fidelity can be inspected.

Variant choice must use an existing stable tree identity/coordinate visual hash,
without consuming simulation RNG. Existing worker projections, felling,
clearing, regrowth slots and seasonal display remain authoritative. The asset
pipeline must not change land yields, tree counts, command history or growth
decisions to fit a rendering budget.

Before a rendering release, compare native summer/winter silhouettes from
several bearings and elevations; check canopy gaps and foliage survival in
every accepted asset; exercise clearing/regrowth and LOD thresholds; measure
main AND shadow draws, triangles, texture memory, overdraw and frame time on
hardware and a touch viewport. Prove the repository's complete 150-day native
world/all-RNG identity contract for the combined display changes. No such
implementation or release validation is claimed by this review.
