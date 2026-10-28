# demo-flow v1: clickable, self-typing scene pages

`demo-flow` turns static beats into a real prototype. The presenter clicks real UI and prompts type themselves into the real composer. Answers stream in, and scenes chain into one another. No visible demo controls are ever added.

Files: `demo-flow.js` (runtime), `demo-flow.css` (reveal, caret and fx classes, plus the hidden backstage overlay). Expected on every stage page: `demo-ambient.js` + `demo-ambient.css` (v1.1), the tier 2/3 ambient layer (reachable overflow, product tooltips, free expanders, inert clicks). See "Ambient layer" at the end, and `assets/fidelity/references/ambient-affordances.md` for per-product evidence. Copy both into the project's `_kit/demo-flow/`. Never fork the runtime per project. If you need behaviour it lacks, use a `call` hook (below) and report the gap.

Test with `assets/tools/flow-walk.py` (see the end of this file).

## Authoring model

1. **One scene page = the FINAL DOM of several consecutive beats on the same surface.** Build it from the judged static beat pages (or their generator). Do not redesign. Every element that appears later carries `data-demo-hide`: messages, answers, popovers, panels, "after" states.
2. **"Before" states that later disappear** (a collapsed accordion that becomes expanded, a home rail that becomes a panel rail) are separate elements. The step hides one and shows the other, or toggles a class with `add`/`remove`.
3. **A think row** (dots, "Working on it…", "Analyzing…") is its own hidden element. `think` shows it for `ms`, then hides it. Pass `keep` if the product keeps it, for example a collapsed "Analyzed" row.
4. **Link order:** the page's own CSS, then `demo-flow.css`, then (end of body) the optional `scenes.js`, the JSON `<script type="application/json" id="demo-flow">`, and `demo-flow.js`.
5. **Triggers are the real elements** the BRK script says to click: the Ask button, the agent title, a Select button, the composer, a chip, an accordion header, a thumbs icon. The selector must hit a visible, unobstructed element at that step. flow-walk clicks it with Playwright's actionability checks, so a covered target is a FAIL.
6. **Prompts are verbatim.** They come from the storyboard, or from what the static page's bubble shows. Typing happens in the composer the page already has. `ph` is the placeholder element to hide. The user bubble (`bubble`) is a hidden element holding the same text.
7. **Rest position:** the last action of a beat (or the step's `rest`) scrolls the pane to the beat's money moment. Match the static beat page's `data-scroll` / `[data-rest]`.

## Step JSON

```json
{"scene": "ch2-lex-home", "root": "../",
 "prev": "../slack/scene-ch1.html?beat=last", "next": "../tableau-next/scene-ch3.html",
 "steps": [
  {"beat": "CH2-01"},
  {"beat": "CH2-02", "on": {"click": ".lex-ask"}, "do": [{"show": ".lb-dock", "fx": "slide"}]},
  {"on": {"click": ".afs-cbox"}, "do": [
    {"type": ".afs-cbox", "ph": ".ph", "text": "…", "bubble": "#q4", "send": ".send"},
    {"think": "#t4", "ms": 2200}, {"stream": "#a4", "follow": ".afs-dock-body"},
    {"scroll": ".afs-dock-body", "to": "#q4", "offset": 8}]}
 ]}
```

- **Step 0** is the load state. Its `do`, if any, runs instantly at boot.
- **`beat`** starts a new beat. Steps without `beat` belong to the previous beat. A beat's end state is the end of its last step, and that is what `?beat=X` renders and flow-walk diffs.
- **`on`** sets the trigger:

  | Value | Meaning |
  |---|---|
  | `{"click": sel}` | the presenter clicks that element |
  | `{"key": "Enter"}` | the presenter presses that key |
  | `{"auto": ms}` | runs by itself ms after the previous step ends |
  | omitted | → / PageDown only |

  → also always works as a fallback for any trigger.

| Action | Fields | Notes |
|---|---|---|
| `show` / `hide` | sel, `fx` fade\|pop\|slide | all matches |
| `add` / `remove` | sel, `cls` | class toggles: hover, open, selected, checked, on |
| `type` | sel (composer box or input), `text`, `ph`, `bubble`, `send`, `sendOn` (class put on send while text is present), `wait` enter\|none, `pace` auto\|keys, `into` (sel inside box to type into) | human cadence with punctuation pauses. Then waits for Enter / → / a click on `send`, clears the composer and pops the bubble |
| `think` | sel, `ms`, `keep` | |
| `stream` | sel, `wps` (default 24), `follow` (pane to keep pinned to the bottom) | word-by-word over text nodes. `svg`, `img`, `canvas`, `video`, `tr` and `[data-atom]` fade in as units. Mark rows you want as units with `data-atom`; `[data-stream-skip]` is excluded |
| `scroll` | pane sel, `to` end\|top\|sel, `offset` | smooth when live, instant on jump |
| `wait` | ms | |
| `press` | sel | visual press feedback only |
| `goto` | url | mid-scene navigation (rare; prefer `next`) |
| `call` | hook name, `el`, `arg` | `window.demoHooks[name](el, {instant, fast, sleep, arg})`. Must be instant-capable: when `instant` is set, jump straight to the end state |

Every action must be **instant-capable**. `?beat=`, ←, and reload all fast-forward by replaying steps with `instant=true`.

## Presenter keys (never shown on screen)

| Key | Action |
|---|---|
| → / PageDown | next step. During typing or streaming it hurries the animation. While a typed prompt waits, it sends |
| ← / PageUp | back one beat |
| Shift+R | restart the scene |
| `` ` `` | backstage beat list (jump anywhere) |
| Esc | close the backstage beat list |
| Enter | send a typed prompt |

URL: `?beat=CH2-03`, `?beat=last` or `?step=4` renders that state instantly. `?speed=2` types and streams faster (flow-walk uses 4).

At the end of a scene, → (or `next`) navigates to the next scene with a view-transition crossfade (over http(s); on `file://` it hard-cuts, because Chrome 150+ aborts the transition there). The next page is prefetched.

## Scene chain

`_kit/demo-flow/scenes.js` sets `window.DEMO_SCENES = [{id, url, beats}]` in presentation order. Each url is relative to the project root. The backstage list uses it, and each scene's `prev` / `next` follow it. The root `index.html` launches the first scene.

## Testing

```
python3 assets/tools/flow-walk.py <proj>/<folder>/scene-x.html --out /abs/out --ref-dir <proj> [--viewport 1456x900] [--follow]
```

It clicks every trigger, lets prompts type, and sends them. It screenshots each beat end (`CH2-03.png`) and the first typed frame (`_typing-*.png`). It then checks the following:
- `?beat=` jump == walked state (sim ≥ 0.97)
- walked state vs the static beat page (sim ≥ 0.90)
- no console errors, page errors or failed requests

rc 0 = PASS, 1 = WARN, 2 = FAIL. Use `--follow` to walk the whole chain. Use the default bundled Chromium: managed Macs can block DevTools on installed Chrome (`--channel chrome`), which kills the page mid-walk.

With the ambient layer (below), flow-walk also runs an **ambient pass** per beat. Every finding is a WARN, so a page without the layer drops from PASS to WARN until its clips and charts are resolved. `--no-ambient` restores the old behaviour. `--inject-ambient <kit demo--flow dir>` injects the layer into a page that does not include it yet, for read-only diagnosis.

| Check | Fires when | Fix |
|---|---|---|
| UNREACHABLE CLIP | a visible box with `overflow: hidden/clip` hides ≥ 8 chars of text (this includes `text-overflow: ellipsis` cells), or an auto box whose X overflow has its bar hidden while the layer is absent, and it is not marked | `data-amb-scroll` if the product scrolls there, `data-amb-clip-ok` if the product clips too |
| CHART WITHOUT TIPS | an svg ≥ 80×50 with ≥ 3 marks has no `[data-tip]` and no `<title>` (svgs inside `[data-demo-hide]`/`[hidden]` are skipped) | add `data-tip` with real values, or `data-amb-notip` |
| NATIVE TIPS ONLY | the chart has `<title>`s but the layer is not loaded (OS yellow box, not product anatomy) | include `demo-ambient.js` |
| TIP probe | hovers the first unobstructed `[data-tip]` mark and writes `_tip-<beat>.png`; the tooltip must be visible and inside the viewport | |
| SCROLL probe | wheels every `data-amb-scroll` box to its end and writes `_scroll-<beat>.png`; then `demoAmbient.reset()` must restore the at-rest pixels (sim ≥ 0.99) | |
| INERT LEAK | clicking one of up to 10 non-trigger `a`/`button`/`[role=button]` elements changes the URL or `demoFlow.step` (errors are FAILs as usual) | include the layer; real `href` on decoration is a bug |

**Known blind spots of the v1.0 ambient pass (do these by hand until flow-walk is fixed; see `references/prototype-lessons.md`, Open kit gaps):**
- Screenshots are taken with the mouse wherever the last click left it. Hover tints and overlay thumbs then lower the jump/ref sims although the rest state is pixel-identical. Move the pointer to a neutral spot before you diff.
- The TIP probe hovers only the *first* `[data-tip]` in DOM order (often the header Ask button), so chart tips are never exercised. It does not scroll a mark below the fold into view. Hover one mark per chart and per skin yourself.
- CHART WITHOUT TIPS ignores `<img>` charts, small sparklines (< 80×50 or one polyline) and CSS/div bar charts, so "0/0" can hide undecided charts.
- INERT LEAK does not click `[data-amb-inert]`, `[role=tab]` or `[role=menuitem]`, and it does not check focus rings or stuck press states. Its Playwright click scrolls the target into view, which moves scrollers. Nothing flags dead controls (cursor:auto on things that look clickable).
- The SCROLL probe aims at boxes nested in a scrolled-away thread too, which gives false "could not be wheeled" WARNs.
- `notip` waivers print `—` in the Tip column. Write the reason in a comment next to the attribute.
- Relative scene paths crash flow-walk (`IndexError` on `h.parts[-2]`). Pass an absolute path.

Results go into `FLOW-WALK.md` (the "Ambient (tier 2/3)" table) and `flow-walk.json` (the `ambient.beats[BEAT]` key holds the clips, charts, tip, scroll, reset_sim and inert results).

## Ambient layer (tier 2/3): `demo-ambient.js` + `demo-ambient.css` (v1.1)

The story path (tier 1) is demo-flow. The ambient layer covers what a presenter touches *while talking*. It must behave like the product and never change the story:

- **Tier 2:** reachable overflow, viz tooltips, hover states, free expanders, and resize only where there is evidence for it.
- **Tier 3:** everything else looks clickable (cursor, hover, press flash) and does nothing. It never navigates and never throws.

**Rule for margins:** if the real product lets you reach the content, the prototype scrolls to it. If the product clips it, the prototype clips it, marked with `data-amb-clip-ok`.

**Per-product evidence lives in `assets/fidelity/references/ambient-affordances.md`.** Look there first: tooltip anatomy and CSS, mark hover, scroll and scrollbars, resize yes/no/unknown and expanders for Tableau Cloud, Pulse, the Tableau Agent panel, Tableau Next, the Agentforce LEX panel, Coworker, SLDS and Slack, each with a confidence level. This README is the attribute contract.

It is purely attribute-driven, adds **zero visible controls**, and **paints nothing at rest** (v1.1 fixed the v1.0 exception: the `icon` radius now applies only on `:hover`; `width:max-content` on `div` toggles is the one at-rest change, opt out with `data-amb-full`). Beat screenshots, `?beat=` jumps and reference diffs are unchanged unless something is hovered. It works on static beat pages too (no demo-flow needed).

### Decide the tier (do this for each element before you tag it)

1. **Story trigger** at this beat or a later one? Tier 1. Leave it alone (the layer skips the current and later `on.click` targets). A `data-amb-scroll` box may contain a later trigger or be scrolled by a later step (v1.1 handles both, see "Reset" and the `demo:scroll` handshake).
2. **Would using it change what the audience is told?** (select or filter a mark, clear chat, collapse or pin the agent pane, open a modal or lightbox with no capture, download) Tier 3: `data-amb-inert`, or nothing if it is already a button/link.
3. **Does the product show it without changing the story, and can you source its content?** Tier 2: tooltip (`data-tip`), scroll (`data-amb-scroll`), hover (`data-amb-hover`), toggle (`data-amb-toggle`, only if the open state is captured or already on the page).
4. **No capture of the open, resized or scrolled-to state?** Tier 3. Never invent the content.
5. **Resize:** only with a capture of the handle or another width. The ambient-affordances catalogue currently lists every BRK surface as *unknown* or *no*.

**Include order** (after demo-flow, always):
```html
<link rel="stylesheet" href="../_kit/demo-flow/demo-flow.css">
<link rel="stylesheet" href="../_kit/demo-flow/demo-ambient.css">
…
<script type="application/json" id="demo-flow">…</script>
<script src="../_kit/demo-flow/demo-flow.js"></script>
<script src="../_kit/demo-flow/demo-ambient.js"></script>
```
kit-init copies both files into `_kit/demo-flow/` with the runtime. demo-flow.js (v1.1) gained the `demo:scroll` dispatch and `demoFlow.scrolled(el)`; copy all four files together (an old demo-flow.js still works, but its scrolls are then only caught by the "scrollTop differs" rule). The layer reads `body[data-demo-busy]`, `window.demoFlow.steps/step/running` and `defaultPrevented`. Included at the end of `<body>`, it initialises on `DOMContentLoaded`, so a page script placed after it must also wait for `DOMContentLoaded` before it touches `.amb-tip` or wraps `demoAmbient.reset`.

### Attributes

| Attribute | On | Does |
|---|---|---|
| `data-amb-scroll="x\|y\|both"` | the clipping box | Becomes `overflow:auto` on that axis (`!important`; an empty value = both). The native bar is hidden (`scrollbar-width:none` + `::-webkit-scrollbar{width:0;height:0}`, so no gutter and no reflow), and `overscroll-behavior: contain` is set. Size and rest scroll stay the same. A JS overlay thumb (in a `position:fixed` layer, min length 24px) draws only on hover and for about 900ms after a user scroll, is clipped to the intersection of the box with every overflow ancestor (so it respects `margin-right` bleeds under a panel edge), and can be dragged. On an `x`-only box a vertical mouse wheel scrolls sideways. If the box bleeds under an edge with `margin-right:-N`, add `padding-right:N` so the last column can clear the edge. Also use it on inner scrollers that fit at the stage size (Coworker `.bd-scroll`): it stops presenter laptops with always-on bars from adding a gutter |
| `data-amb-sb="mac\|fluent\|slack\|none"` | box, ancestor or `<body>` | Thumb skin. `mac` (default): rgba(0,0,0,.45), 6px, inset 2px, radius 3 (Mac captures i-061). `fluent`: #8b8b8b, 7px, inset 3px, radius 4 (Windows captures i-031/i-033). `slack`: rgba(0,0,0,.45), 6px, inset 3px, radius 3. `ios`: transient bar, 3px rgba(0,0,0,.35) inset 2px, drawn only while the box scrolls (never on hover, not draggable; LOW: product knowledge). Put `data-amb-sb="ios"` on a natively scrolled box (no `data-amb-scroll`) and its native bar is hidden and replaced by the transient one. `none`: no thumb. Choose from the **capture OS**, per box when one scene mixes OSes |
| `data-amb-rest` | native pane or demo-flow-driven thread | Restore-only: no overflow change, no thumb. Its scrollTop is captured on the first idle user gesture inside it (wheel, pointerdown, touch) and restored when a step starts or on `reset()`. Use it on panes left native and on chat threads that streams scroll. Once a step takes over (see `demo:scroll`) it stops restoring |
| `data-amb-clip-ok` | box | Waiver: the product clips here too (card insight line-clamp, ellipsis cells, a phone edge, a pane that overlays the page, a dashboard that scrolls to content nobody captured) |
| `data-tip="Label: value\|Label: value"` | any mark (svg or html) | Tooltip rows. Each row splits on the first `": "`; a row without one is plain text. `data-tip-title` adds an optional first row. Use only the fields the viz encodes |
| `<title>` child of an svg mark | | Converted to `data-tip` **once, at init**, and removed, so the OS tooltip never doubles up. Newlines become rows. Not converted: a `<title>` directly under `<svg>` (whole-chart title), and marks added to the DOM after init. Under `data-amb-notip` the titles are simply removed. **Audit the text first**: it often carries more precision than the page shows |
| `data-tip-skin` | mark, ancestor or `<body>` | `tableau` (default), `pulse`, `tnext`, `slds`, `slack` (see the table below). Mixed pages: set it per panel, and `data-tip-skin="slds"` on LEX chrome triggers |
| `data-amb-notip` | svg/chart or ancestor | The product has no mark tooltips here (Slack server-rendered chart images, touch-only mobile frames, Pulse line charts). Silences CHART WITHOUT TIPS. Put the reason in an adjacent comment |
| `data-amb-toggle` | expander header | Free open/close. Default mode reads the open state from `aria-expanded` on itself, and **when that is missing from the target's visibility** (hidden, `data-demo-hide`, `display:none`); it flips `aria-expanded` and sets `hidden` on the target (`data-amb-target` selector, else the next sibling); opening also removes `data-demo-hide` from the target. `data-amb-toggle="class:NAME"` toggles a class on the target (default: the header itself). `data-amb-toggle="swap:#a,#b"` (on either header, or on both) shows whichever of the two is hidden and hides the other with `data-demo-hide` (the demo-flow swap accordion; no wrapper CSS needed). The rest state is snapshotted per **target** (first toggle wins), so two toggles sharing a target reset cleanly, and the scroll of every scrollable ancestor is restored on reset. Skipped while demo-flow is busy, and while the header is the trigger of the current or any later step, so a story accordion becomes a free toggle only *after* its beat. See the toggle patterns below |
| `data-amb-resize="left\|right"` | panel | **Evidence-gated.** Hovering the edge (±4px) shows a col-resize cursor and a 3px accent bar (`--amb-resize-accent`, default #0250d9). Drag changes the visible (border-box) width within `data-amb-min`/`data-amb-max` (px; defaults 200 / 70vw); content-box padding is accounted for. Double-click the edge resets. With `data-amb-resize-var="--lf-panel-w"` (+ `data-amb-resize-var-on="sel"`, default body) it sets a CSS var instead of the width. No DOM is added inside the panel. No keyboard resize: the arrow keys belong to the presenter |
| `data-amb-hover="row\|ul\|icon\|tint"` | rows, links, icon buttons | Hover utilities, all with `cursor:pointer`. row = #f3f3f3 (SLDS/Next, i-063/i-038) or #f8f8f8 under `data-tip-skin="slack"` (i-024), override with `--amb-row-hover`. ul = underline (`!important`, so pasted chrome's inline `text-decoration:none` no longer beats it). icon = rgba(0,0,0,.06) plus `border-radius:4px`, both only on `:hover` (v1.1: nothing at rest; `--amb-icon-hover`, LOW confidence). tint = brightness .97 |
| `data-amb-inert` | anything | Treat as a tier-3 control (`cursor:pointer`, press flash, `preventDefault`) |
| `data-amb-chrome` | a region | Marks a chrome region for tier 3, like `header`, `nav` and `[role=banner]`: inside one, a bare `<a>` without `href` and a `span[title]` that holds an svg/img (or has no text) are inert controls without further tagging |
| `data-amb-full` | a `data-amb-toggle` `div` | Opt out of the default `width:max-content` (`:where()`, zero specificity, so page CSS also wins). Use it when the header is a flex row with a right-aligned caret |
| `data-amb-tip-bounds="sel"` | mark, ancestor or `<body>` | Clamp and flip the tooltip inside that zone (the mark's closest match, else `document.querySelector`), intersected with the viewport, as Tableau does inside the viz zone. Placement is otherwise viewport-bound. Ignored if the zone is under 40x20px |
| `data-amb-series="captured"` + `data-amb-scrub="Label: value\|…"` | `<polyline>` in an svg | **Pulse line scrub:** while the pointer is inside the series' x range, a 1px rule, an 8px dot (series stroke colour) and the pulse one-line tip follow the nearest point. One `data-amb-scrub` row per point (same count as `points`, else no scrub). The generator sets `captured` only for values that come from a capture or source table; digitized series never get it (the attribute is the gate) |
| `data-amb-allow` | element or ancestor | Let the click through untouched (a deliberate page script or link) |

#### Toggle patterns

- **Hit area:** a block-level header (`display:flex/block`) makes the whole row width a pointer target, so a stray click collapses content. Put the toggle on an inline/inline-flex wrapper around the label and caret, or add `[data-amb-toggle]{width:max-content}` (pixel-neutral on a left-aligned header).
- **Story-opened accordions without `aria-expanded`:** v1.1 reads the open state from the target's visibility, so a plain `data-amb-toggle` works even when a story step opened the body. (v1.0 needed a wrapper with `class:amb-shut`; that pattern still works.)
- **Swap-style accordions** (demo-flow hides a collapsed header and shows a separate open block): put `data-amb-toggle="swap:#collapsed,#expanded"` on both headers. Reset restores which one is shown. No wrapper or display CSS.
- Migrating a page: **delete page-local expander and press-flash scripts.** Otherwise both fire, a double toggle cancels itself, and the flash doubles.

### Tooltip skins (evidence; most-neutral choice where confidence is low)

| Skin | Placement | Look | Confidence and source |
|---|---|---|---|
| `tableau` | pointer +14/+16, flips at the viewport edges (not at the viz zone: tips can spill over an agent panel), 350ms delay | #fff, 1px #d4d4d4, radius 1, shadow 0 1px 4px .2, padding 6/8, 12px, `Field:` regular #333 + **value** #000, one row per field | LOW: no capture of a Tableau Cloud viz tooltip exists (kit manifest gap) |
| `pulse` | centred 10px under the mark, 80ms | #fff, 1px #d9e3f2, radius 4, padding 8/12, 13px, ONE line `South **44%, US$48.9K of US$111.6K**` (rows joined with ", ") | MEDIUM: sampled from plates/tableau/real/pulse-chart-detail.png. **Breakdown bars only**: Pulse lines scrub, so use `data-amb-notip` |
| `tnext` | pointer +12/+14, 200ms | #fff, 1px #e5e5e5, radius 8, padding 8/12, 12px, label #5c5c5c, value **#181818** | LOW: no capture; same renderer as the Agentforce/Coworker answer charts |
| `slds` | below the trigger with the nubbin on top, flips above; 350ms; wraps | #032d60 (sampled, NOT the spec's #16325c), white 13px, radius 8, padding 8/12 | MEDIUM-HIGH: i-043, i-031 |
| `slack` | above the trigger, flips below; 300ms | #1d1c1d, bold white 13px, radius 6, padding 6/10 (the nubbin class is set, but no caret is visible) | LOW-MEDIUM: product knowledge |

`slds` and `slack` use a single text line (rows joined with " · "). All skins: `max-width:320px`, nowrap except `slds`.

Behaviour: `pointer-events:none`, hidden while `body[data-demo-busy]`, hidden on any pointerdown or click (and suppressed until the pointer leaves that mark), on Esc, on leaving the window, and on window resize. **Mark hover treatment is cursor-only**, and only the `tnext` and `pulse` skins set `cursor:pointer` on marks (Tableau Cloud keeps the arrow). No product evidence shows sibling marks dimming on hover; Tableau dims only on *select*, which changes the story, so it is tier 3. The hovered mark gets `[data-amb-hot]` if a page needs a sampled treatment. A Pulse line *scrub* (rule + dot + value moving along the series) exists in v1.1 only for series the generator marks `data-amb-series="captured"` with a `data-amb-scrub` row per point; digitized series (values traced from pixels) still get nothing, or `data-amb-notip`.

Mark tips that are hard to hit: give a thin svg line (≈1.8px) a sibling `polyline` with the same points, `stroke="transparent" stroke-width="10" pointer-events="stroke"` and the same `data-tip`. For CSS bar charts, put `data-tip` on the bar fill, not on the row.

### Data rule (non-negotiable)

Tooltip and table values come only from the page (labels, axes, cells), the scene generator's own data, STORYBOARD.md, or a referenced capture. If a value is unknowable, that mark gets **no** `data-tip`; report it. Values digitized from screenshot pixels (series traced from a capture, bar heights) are not values: those marks get dimension-only rows or nothing, and the generator should mark each series as `captured` or `digitized`. One precision standard per scene. Truncated labels (`Roofing & In…`) need a source for the full name (search the whole project), or stay truncated.

**Opening a clip exposes everything behind it.** Run the pre-flight in `references/ambient-affordances.md` §4 before you set `data-amb-scroll`: source every hidden row and column, check that it agrees with the capture and the storyboard, screen filler for real people (555-01xx phones), make the filler honour the prose (`Found N rows`, sort order, repeats), and trim tail spacers. BRK CH5-09 showed invented rows 10-69, famous names, and a Created month that contradicted i-057.

**Audit every `title=` and `<title>`** already in a scene (`rg -o 'title="[^"]*"' | sort -u`), including ones inherited from lane source or kit fixtures. Each one is a tier-2 tooltip on stage. Help-icon `(i)` titles are the usual source of invented copy. Before you convert a `title` to `data-tip`, search the CSS for `[title=` (a notification badge was drawn from it) and keep titles that demo-flow selectors use.

### Story safety and reset

- The click handler runs in the bubble phase, after demo-flow's capture handler. Anything demo-flow handled (`defaultPrevented`) is skipped. The layer never calls `stopPropagation`, so page scripts still hear every click.
- Tier 3: clicks on `a[href]`, `button`, `[role=button|tab|menuitem|link]` and `[data-amb-inert]` get `preventDefault` (so `href="#"` no longer adds `#` and a history entry) plus a brightness press flash. Big elements (> 480×160) get no flash. `summary`, `input`, `select`, `textarea` and `label` keep their native behaviour. Clicks inside `[data-demo-overlay]`, `[data-demo-control]` or `[data-amb-allow]` are left alone. `auxclick` on links and `dragstart` on links/images are blocked. `html, body { overscroll-behavior-x: none }` stops a two-finger swipe from triggering browser back on stage.
- **Chrome regions** (`header`, `nav`, `[role=banner]`, `[data-amb-chrome]`): a bare `<a>` without `href` and a `span[title]` icon (svg/img child, or no text) are tier 3 automatically. Still **not caught:** `<li>`/`<div>` controls and untitled spans (waffle, nav tabs, Tableau Next left nav, crumbs, quick filters, legend items). Tag them `data-amb-inert` (or wrap the region in `data-amb-chrome`) until the kit chrome ships the hooks.
- **Focus:** after a tier-3 click, a story-trigger click, and when a step starts, the focused element is blurred on the next tick (inputs, textareas, selects and contenteditable are skipped), so no `:focus-visible` ring survives into the next beat. Do not use `:focus-visible{outline:none}`.
- Typing, Enter, →/←, Shift+R and the backtick overlay are untouched (keyboard is only read for Esc).
- **Reset:** the rest position of a scroll box (`data-amb-scroll` or `data-amb-rest`), a toggle's state (per target, first wins, plus its scrollable ancestors) and a panel's width are captured lazily on the first *user gesture* (wheel, pointerdown, touchstart, thumb drag; not keyboard). The first wheel anywhere on an idle page snapshots every scroll/rest box (Chromium can route a wheel over a sibling to a clipped box). A pointerdown on a story trigger is not a user gesture. Everything is restored when a demo-flow step starts (`data-demo-busy` turns on) and on `demoAmbient.reset()`. Scroll restores are re-applied at 0/60/200/450/900ms because Chromium animates wheel and momentum scrolling after the call; another user gesture cancels them.
- **`demo:scroll` handshake:** demo-flow dispatches `demo:scroll` on `document` (`detail` = the element) for its own `scroll` action, `step.rest`, stream `follow` scrolls and any hook that calls `opts.scrolled(el)` (also `demoFlow.scrolled(el)`). The layer then drops that box's rest and its pending re-applies. As a second guard it stops re-applying a box as soon as its scrollTop differs from the value it last wrote, which also covers a hook that scrolls without telling it. A hook that scrolls a pane **synchronously at step start** must call `opts.scrolled(el)`, otherwise the step-start reset overrides it. ←, Shift+R and `?beat=` reload the page, so they start clean anyway.
- **Busy:** toggles and tips do nothing while demoFlow is busy (for example during a long composer prefill). That is correct; critics should test only when `body` has no `data-demo-busy`.
- `window.demoAmbient = {version ('1.1'), reset(), hide(), info(), tipsShown, inertClicks, toggles, resizes}`. `info()` returns attribute counts and whether a tip is visible.

#### Known bugs and stopgaps

**v1.1 closed all twelve v1.0 gaps** (story-trigger snapshot, demo-flow scroll handshake, per-target toggle rest, focus ring, `data-amb-rest` and first-wheel snapshot, ancestor scroll restore, visibility-inferred and `swap:` toggles, CSS fixes, `data-amb-tip-bounds`, `ios` skin, Pulse scrub, tier-3 chrome). Nothing is known-open in the layer itself.

**Pages still carrying v1.0 stopgaps can drop them** after copying all four v1.1 files. `rg 'demo-ambient v1.0 gap'` finds the tagged ones. Known carriers:
- BRK `scene_ch5_dashboard.py` `PAGE_JS`: the tooltip-bounds clamp (replace with `data-amb-tip-bounds="<viz zone selector>"`) and the thread reset (replace with `data-amb-rest` on the thread/pane).
- BRK `scene_ch2.py` `AMB_HOOK` (`ambRelease` hook, the shared-target class clear), `scene_ch1.py` `HOOK_JS` `nrestore` (use `data-amb-rest`), and any wheel `preventDefault` shim over non-scrolling regions (the first-wheel snapshot replaces it), any MutationObserver that blurs `document.activeElement`, and page-local CSS for `data-amb-hover="icon"` radius or `width:max-content` toggles.
- Check after removing each one: the same beat re-walked with flow-walk, plus the wheel-then-click-next-trigger check in the notes below.

Still true in v1.1: a page script after demo-ambient must defer to `DOMContentLoaded` before it touches `.amb-tip` or wraps `demoAmbient.reset`.

### What lanes do per scene (checklist)

1. Run flow-walk (absolute path). Every UNREACHABLE CLIP gets a decision with evidence from `references/ambient-affordances.md`: `data-amb-scroll` (the product scrolls there; for example, Tableau Agent answer tables are their own overflow:auto box, i-061/i-057) or `data-amb-clip-ok` (the product truncates too; for example, Pulse card insight line-clamp, Slack Block Kit cells that the product reaches via Expand, a phone frame edge, an overlaid pane). **Run the clip pre-flight before every `data-amb-scroll`.** If a pane already scrolls natively and the reference shots include its bar (slack-shell `.sk-messages`), leave it native.
2. Every CHART WITHOUT TIPS gets `data-tip` with sourced values, or `data-amb-notip` with the reason in a comment (Slack chart = server-rendered image, i-024 `&amp;` artifact; Pulse line = scrub; touch-only phone frame). Also decide `<img>` charts, sparklines and CSS bar charts, which the probe does not count.
3. Set `data-tip-skin` on `<body>` (or per panel when products are mixed: an SLDS header over a Tableau Next answer). Give every LEX header Ask button its captured tooltip (`Ask Agentforce Coworker`, `data-tip-skin="slds"`).
4. Set `data-amb-sb` from the capture OS (`fluent` for Windows/Segoe captures, `mac` for Mac, `none` for mobile), per box if one scene mixes OSes.
5. Leave resize off unless a capture shows the handle or a resized state. The Tableau Agent "Expand pane / Collapse pane" strings exist in source, but no capture shows those buttons.
6. Tag tier-3 chrome that is not a/button/role (spans, bare `<a>`, `li` tabs, filter boxes, legend items) with `data-amb-inert`, and check there are no dead-looking controls with `cursor:auto`.
7. Re-walk: the TIP and SCROLL probes must pass with reset sim ≥ 0.99, and there must be no INERT LEAK. Then do the manual checks for the blind spots listed under Testing (neutral pointer, one tip per chart, inert spans, focus rings, wheel-then-click-next-trigger).

**Authoring patterns for generators you must not edit** (the static beat pages are frozen):
- Do the ambient wiring as a **counted string-replacement pass** in the scene generator's `finish()`: a `sub1(old, new, n)` helper asserts each fragment's count, so markup drift fails loudly (a plain regex once silently tagged nothing). Exempt story triggers explicitly. Write the evidence comment for every `notip`/`clip-ok` next to the list.
- To tip charts from a generator module you can't edit, wrap its svg functions before the page is built, and derive each `data-tip` by regex from the svg's own label/value `<text>`, with a count assert. For data, patch the imported module's data before calling its `page()`, and assert that the captured rows stay byte-identical.
- To get exact sourced values, write `data-tip` from an explicit sourced table, strip `<title>`s, and assert none remain. Don't rely on auto-conversion for data you have not audited.
- **Runtime copy:** prefer kit-init. If a generator copies `_kit/demo-flow/*`, copy all four files (`demo-flow.{js,css}`, `demo-ambient.{js,css}`), only when the bytes differ, and make a `.bak-<timestamp>` first. Better still, only assert equality and warn on drift.

### Critic and verification notes

- Compare story safety against a **baseline walk stopped at the same step**, not against the `?beat=` jump (a jump includes the beat's later steps).
- `?beat=X` lands after the last step of X, so the next trigger is the first step of the next beat. Steps finish asynchronously: wait 6-8s at 1× (or poll `demoFlow.busy === false`) before you decide a trigger failed. A `type` step with `send` waits for Enter forever: poll `demoFlow.waiting === 'enter'` and press Enter.
- Click sweeps must exclude current and future story triggers (match `demoFlow.steps[*].on.click` with `closest`) and the composer.
- Hover probes: hit-test with `elementFromPoint`, scroll the mark's scroll box into view first, and skip off-screen elements. Wait about 2s after wheel tests before screenshots (elastic overscroll).
- Focus-ring and stuck-state probe: for each visible control, reload `?beat=`, click, press Shift, move the pointer to a corner, wait 1.3s, screenshot, and diff against the rest shot. Skip the element if the step changed or demoFlow is busy (it was a trigger). A max channel delta ≤ 2 is noise. Expected state changes from `data-amb-toggle` are whitelisted.
