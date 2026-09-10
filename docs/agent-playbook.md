# Replicating a live design site in code — an agent playbook

How this repo was built: a pixel-faithful Next.js rebuild of a Framer marketing
site, reverse-engineered from the running page rather than from a design export.

This is written for another agent picking up the same kind of task. It is not a
description of what happened; it is the procedure, the probe code, and — most
usefully — the catalogue of traps that cost real time. Read §6 before you start,
not after.

---

## 0. When this applies

Use this when you must reproduce an existing rendered page — a Framer/Webflow
site, a competitor's page, a staging build — in your own stack, and "close
enough" is not the bar.

Do **not** use this to guess at a design from a screenshot. The whole method
rests on having a live URL whose DOM you can interrogate. Without one, you are
eyeballing, and you should say so to the user rather than pretending otherwise.

---

## 1. Establish the source of truth, and say so out loud

Rank your sources before you write a line of code:

| Source | Trust | Why |
|---|---|---|
| **Live rendered site** | Highest | Computed styles, real animation timings, real asset URLs, real DOM order |
| Figma / design file | Medium | Correct intent, but see below |
| Screenshots | Low | No numbers. Fine for "does this look right", useless for "what is it" |
| Your memory of similar sites | None | You will invent something plausible and wrong |

**Design exports lie by omission.** In this project the Figma export:

- outlined every text run to vector paths — zero `<text>` elements, so the SVG
  was unusable as markup and the type had to be rebuilt from scratch anyway;
- carried no layer names, only generated ids;
- contained **no keyframes and no prototype transitions** — `get_motion_context`
  returned `{"nodes":[]}` for both frames. Every piece of motion on the live site
  was invisible in the design file.

That last point is the one that decides the method. If the motion only exists in
the running page, the running page is the specification.

Write the ranking into your first message to the user and stick to it. Half the
value here is that when the user later says "that's not what the design shows",
you both already agreed which artefact wins.

---

## 2. Build a probe harness first

Before any component work, get to where you can ask the live page arbitrary
questions and get numbers back. Budget for this; it pays for itself within the
first section.

### 2.1 Driving a browser from outside the project

Scripts live in a scratchpad, not the repo — they are throwaway instruments, not
deliverables. That creates one wrinkle: Node resolves `require` relative to the
script, so a scratchpad script cannot see the project's `node_modules`. Point
`createRequire` at the *project's* `package.json`:

```js
import { createRequire } from "node:module";
const require = createRequire("/abs/path/to/project/package.json");
const { chromium } = require("playwright-core");
```

Use `playwright-core` with an explicit `executablePath` rather than `playwright`.
`playwright` wants to download a browser; `playwright-core` uses one you already
have. Find an installed Chromium once and reuse the path:

```js
const browser = await chromium.launch({
  executablePath: "<...>/ms-playwright/chromium-XXXX/chrome-win64/chrome.exe",
});
```

### 2.2 The standing skeleton

Every probe script should start from this. The error capture is not optional —
it is how you find the 404 that silently broke the run you were about to believe.

```js
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
page.on("pageerror", (e) => errs.push(String(e).slice(0, 140)));
page.on("response", (r) => r.status() >= 400 && errs.push(r.status() + " " + r.url()));

await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 90000 });
await page.waitForTimeout(6000);   // let the site's own JS settle

/* ... probe ... */

console.log("errors:", errs.length ? errs.slice(0, 5) : "none");
```

Always print the error list, even on a run that looked fine. A silent 404 on a
JS chunk is indistinguishable from "the feature does not work" until you look.

---

## 3. The loop

For each section, in order. Do not batch sections — finish one, show it, move on.

1. **Locate** the section in the live DOM.
2. **Measure** geometry, colour, type and motion.
3. **Extract** the real assets (see §5.2).
4. **Rebuild** in your stack from those numbers.
5. **Verify** numerically, then visually.
6. **Report** what you measured, and flag anything the numbers could not settle.

The discipline that makes this work: **never write a value you did not read.**
If you find yourself typing `padding: 24px` because it looks about right, stop
and go measure it. The whole method collapses the moment you start guessing,
because you lose the ability to tell your errors from the design's quirks.

Corollary, and it comes up constantly: when the live site does something that
looks like a bug, reproduce it faithfully and *tell the user*. In this project
the FAQ hover has `transition-duration: 0s` — a hard cut. It looked broken. It
was faithful. Reporting "live really is instant; here is a 0.5s eased version if
you want it" is right; silently smoothing it is not, and neither is silently
copying it without mention.

---

## 4. Probe recipes

These are the ones that earned their keep. Each solves a class of question you
will definitely hit.

### 4.1 Find the real container — ancestor chain walk

You almost never want the element containing the text. You want the box some
number of levels up that carries the layout. Do not guess the level; print the
whole chain and read it.

```js
const chain = await page.evaluate(() => {
  const leaf = [...document.querySelectorAll("*")].find(
    (el) => el.children.length === 0 && /LINQ BUSINES/i.test(el.textContent || ""));
  const out = [];
  for (let e = leaf; e && e !== document.body; e = e.parentElement) {
    const cs = getComputedStyle(e), r = e.getBoundingClientRect();
    out.push({
      tag: e.tagName, cls: String(e.className).slice(0, 50),
      pos: cs.position, z: cs.zIndex, bg: cs.backgroundColor,
      rect: `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`,
      op: cs.opacity, tf: cs.transform, clip: cs.clipPath, willc: cs.willChange,
    });
  }
  return out;
});
```

Read `position`, `z-index` and `will-change` off that chain. `will-change:
transform` on an ancestor is a strong hint that *this* is the animated node.

**Trap:** a selector like "full-viewport div containing the nav text" will
happily match the page wrapper. Verify the match by its height — if you get
`12597px` back for something you expected to be `900`, you matched the document,
not the overlay.

### 4.2 Capture an animation — sample it over time

Computed style at rest tells you nothing about motion. Poll it.

```js
async function sample(label, ms, sel) {
  const rows = [];
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    rows.push(await page.evaluate((s) => {
      const el = document.querySelector(s);
      if (!el) return "GONE";
      const cs = getComputedStyle(el);
      return `${Math.round(performance.now())} op=${(+cs.opacity).toFixed(3)} ` +
             `tf=${cs.transform} clip=${cs.clipPath} anim=${cs.animationName}`;
    }, sel).catch(() => "GONE"));
    await page.waitForTimeout(50);
  }
  console.log(`--- ${label} ---\n` + rows.join("\n"));
}
```

Then read the shape out of the numbers. This trace:

```
op=1.000  0.909  0.763  0.485  0.213  0.047  0.002  → GONE
```

is symmetric about 0.5 — an ease-in-out, roughly 440ms, and it *unmounts* at the
end rather than sitting at zero. All three facts matter for the rebuild, and none
of them are visible in a screenshot.

Sample the close as well as the open. They are frequently not mirror images, and
if you only ever watch the open you will assume they are.

### 4.3 Settle a layering question — `elementFromPoint`

"Does the trail pass over or under the button?" is not a matter of opinion:

```js
const el = document.elementFromPoint(x, y);
return el.tagName + (el.closest("a") ? " (inside link)" : " (not link)");
```

### 4.4 Settle a "does it go in front or behind" question — scanline

For artwork questions that computed style cannot answer (does the rail pass
through the hole, or behind the card?), screenshot a strip and walk the pixels:

```js
// In-page: draw the region to a canvas and report runs of dark/light along a row.
const runs = await page.evaluate(async ({ x, y, w }) => { /* canvas + getImageData */ });
```

A brightness-threshold run-length along one scanline answers it definitively.
This is how the testimonial rail turned out to be **three** separate segments —
one behind the card, one short link inside it, one in front — rather than the
single bar it appears to be.

### 4.5 Verify a rebuild — pose-matched pixel diff

Pause both the live page and yours at the same animation offset, screenshot the
same clip box, and diff. Anything above a hairline is a real difference.

**Trap:** Playwright's `clip` takes `{x, y, width, height}` — not `w`/`h`. A
wrong key is silently ignored and you diff the whole viewport.

---

## 5. Framer-specific archaeology

Framer output has several habits that make naive DOM inspection lie to you.

### 5.1 Things that are not where you would look

- **Borders are drawn on `::after` overlays** via `--border-*` custom properties.
  `getComputedStyle(el).border` returns nothing. Look at `::after`, and reproduce
  it as an overlay — an overlay does not shift the box the way a real border
  does, and it lets a punched-through region stay transparent.
- **`<use href="#id">` symbol references.** The visible glyph is defined
  elsewhere in the document. Copying the `<use>` element alone gets you nothing.
- **Animations are JS-driven, not WAAPI.** `el.getAnimations()` returns `[]` and
  `.pause()` does nothing. You cannot freeze them from outside; sample them
  instead (§4.2).
- **Non-breaking spaces.** Text split across animated spans is often joined with
  `U+00A0`, not `U+0020`. A regex with a plain space will fail to match text that
  is on screen and correct. Check `charCodeAt` before concluding the text is
  wrong.

### 5.2 Extracting assets

Pull the designer's real SVG rather than redrawing it. Serialize the live node:

```js
const svg = await page.evaluate((sel) => document.querySelector(sel).outerHTML, sel);
```

**Trap:** an inline `<svg>` in an HTML document has no `xmlns`, because HTML
parsing supplies it. Written to a `.svg` file it is unparseable and renders as
nothing. Add `xmlns="http://www.w3.org/2000/svg"` on the way out.

If no asset exists and you must draw one yourself, build it from primitives
(circle, arc, sweep) rather than hand-written bezier control points — freehand
beziers produce subtle notches and kinks — and **tell the user it is your
drawing, not the designer's**.

---

## 6. The failure catalogue

Every one of these cost time in this project. They are in rough order of how
much.

### 6.1 A CSS animation does not restart when you only change its direction

The one that cost the most, across several attempts.

```jsx
/* WRONG — closing snaps instead of animating */
animation: open ? `fade-in 0.4s ease both` : `fade-in 0.4s ease reverse both`
```

The open animation has already **run to completion**. Changing properties on a
finished animation does not restart it; it re-evaluates the fill value in place.
The fill value of a reversed iteration is the `from` keyframe — so the element
jumps straight to `opacity: 0` on the same frame. It never animates; it resolves.

```jsx
/* RIGHT — a different animation-name is a different animation, and starts at t=0 */
animation: open ? `menu-in 440ms ease both` : `menu-out 450ms ease both`
```

The general rule: **to replay a CSS animation, change its name** (or force
reflow, or use WAAPI). Tweaking duration/direction/delay on a finished one does
nothing you want.

### 6.2 An exiting element must outlive the state that hides it

Unmounting on the same tick the flag flips means there is no element left to
animate. Keep a separate `closing` state and unmount on a timer:

```jsx
const [open, setOpen] = useState(false);
const [closing, setClosing] = useState(false);
const close = () => { setOpen(false); setClosing(true); };
useEffect(() => {
  if (!closing) return;
  const t = setTimeout(() => setClosing(false), CLOSE_MS);
  return () => clearTimeout(t);
}, [closing]);
// render while (open || closing); add pointer-events-none while closing
```

### 6.3 Layout traps

- **Viewport units ignore CSS `zoom`.** `100vh` under `zoom: 0.67` renders at 67%
  of the intended height. Divide it back out: `--screen-h: calc(100vh / var(--zoom))`.
- **Pointer coordinates are screen pixels; layout is zoomed pixels.** Derive the
  scale at runtime — `rect.width / offsetWidth` — rather than reading the zoom
  variable.
- **`position: sticky` breaks under a transformed ancestor.** A scroll-reveal
  wrapper that animates `transform` will silently kill sticky children. Exclude
  those sections from the wrapper.
- **A positioned ancestor with a `z-index` clamps its descendants.** A child
  cannot escape its parent's stacking context however high its own z-index. If
  something must sit above a portaled overlay, it has to live outside the
  wrapper, not merely outnumber it.
- **Absolute positions are authored against the design frame.** Coordinates from
  a 1440×900 design hung on a full-viewport parent drift badly at any other
  width. Give them a fixed-size stage centred in the parent
  (`left-1/2 -translate-x-1/2` on a `w-[1440px]` box). This bug recurred twice
  in this project — once in a section, once in the menu overlay.

### 6.4 Media traps

- **Chrome defers autoplay for off-screen video.** A `<video autoplay>` far down
  the page can sit at frame 0 indefinitely. Set `muted` as a *property* (not just
  the attribute) before calling `play()`, and retry on an IntersectionObserver.
  Swallow `play()` rejections; the next intersection tries again.
- **`preload="none"` / `"metadata"` is only a hint.** A browser that ignores it
  pulls the whole file while your hero is still loading. The only guarantee is to
  withhold `src` until the element is near the viewport.

### 6.5 Hydration traps

- Anything random or time-derived in the first render breaks hydration. If you
  want variety (a shuffled message order, a random start index), either accept a
  visible swap on the first frame or drop the idea. This playbook's own loader
  uses a fixed order for exactly this reason.
- Dead `<script>` blocks left over from a reverted approach will keep producing
  mismatches long after the feature is gone. When you revert an approach, grep
  for its leftovers.

### 6.6 Harness traps — these produce *phantom bugs*

These are the nastiest, because they make working code look broken.

- **`next start` caches the prerendered HTML at boot.** Rebuild while it is
  running and it serves stale HTML pointing at asset hashes that no longer
  exist → 404s on JS chunks → the page never hydrates → your feature "does not
  work". **Restart the server after every build.**
- **A stopped background task may not have released its port.** The new server
  fails to bind and exits, the *old* one keeps answering, and you test the
  previous build without knowing. Kill by port, not by task handle:

  ```powershell
  Get-NetTCPConnection -LocalPort 3100 -State Listen |
    Select-Object -ExpandProperty OwningProcess -Unique |
    ForEach-Object { Stop-Process -Id $_ -Force }
  ```

  The tell: a probe that reports impossible geometry (unstyled layout, elements
  at y=8640) is usually a stale/404'd stylesheet, not a CSS bug.
- **A loose CSS selector measures the wrong element.** `el.querySelector("div > div > div")`
  matched the progress *track* rather than the *fill*, and reported 0% for a bar
  that was filling correctly. Add an explicit `data-*` hook to the element you
  intend to measure, rather than describing it structurally.
- **Clicking a real link in a test navigates away**, and the next `evaluate`
  dies with "Execution context was destroyed". To test `:active` on a link,
  release the mouse somewhere else:

  ```js
  await page.mouse.down();
  /* sample here */
  await page.mouse.move(8, 8);   // release off-target: no click fires
  await page.mouse.up();
  ```
- **`waitUntil: "commit"`** is what you want when timing a loader — `load` and
  `domcontentloaded` are both past the moment you are trying to measure.

---

## 7. Asset forensics

Do this once, early. It is fast and the findings are usually embarrassing.

**1. Are any two files identical?** They were here — the "hero" and "CTA" videos
were byte-identical, the same 16MB clip shipped twice.

```bash
md5sum public/video/*.mp4 | sort | uniq -w32 -d
```

**2. Is anything unreferenced?** Two thirds of the images in this repo were dead
weight from a superseded approach.

```bash
for f in $(git ls-files public); do
  case "$f" in *.png|*.jpg|*.svg|*.webp|*.mp4)
    grep -rqF "/${f#public/}" app components lib || echo "UNUSED $f";;
  esac
done
```

Check for dynamically built paths (`src={`/images/${name}.png`}`) before you
delete anything the sweep flags.

**3. Is the bitrate sane?** `ffprobe` the video. This one was 854×480 at
4 Mbps — roughly six times what the resolution needs.

```bash
ffprobe -v error -select_streams v:0 \
  -show_entries stream=codec_name,width,height,r_frame_rate,bit_rate \
  -show_entries format=duration,size,bit_rate -of default=noprint_wrappers=1 in.mp4
```

**4. Re-encode, then prove the quality.** Do not just ship a smaller file and
assert it looks fine.

```bash
ffmpeg -y -i in.mp4 -an -c:v libx264 -preset slow -crf 26 -r 24 \
  -pix_fmt yuv420p -profile:v high -movflags +faststart out.mp4

# SSIM against the original — >0.98 is visually indistinguishable
ffmpeg -v error -i out.mp4 -i in.mp4 \
  -lavfi "[0:v]fps=24[a];[1:v]fps=24[b];[a][b]ssim=stats_file=-" -f null -
```

Sweep two or three CRF values, take the sizes, then **also** put an original and
encoded frame side by side and look at them. SSIM can miss banding, which is
exactly what gradient-heavy footage (skies, clouds) produces.

`-movflags +faststart` moves the moov atom to the front so playback can begin
before the file finishes. Never omit it for web video. `-an` strips audio from
anything muted.

If the toolchain is missing, install it to the **scratchpad**, not the project:

```bash
npm install --no-save --prefix <scratchpad> ffmpeg-static ffprobe-static
```

The project's `package.json` stays clean, and nobody inherits a 
transcoding dependency they never asked for.

---

## 8. Verification standards

Report a section done only when you can paste numbers. Suggested bar:

- Geometry: measured box matches the live box within ~1px.
- Motion: sampled trace matches the live trace in shape, duration and end state.
- Layering: settled with `elementFromPoint`, not by looking.
- No console errors and no 4xx responses in the probe run.
- `tsc --noEmit` clean, and — for anything touching load behaviour — a
  production build, not just dev. Dev timings are meaningless.

Test the slow path deliberately. Throttling is one CDP call and it is where the
real bugs are:

```js
const cdp = await ctx.newCDPSession(page);
await cdp.send("Network.enable");
await cdp.send("Network.emulateNetworkConditions", {
  offline: false, latency: 80,
  downloadThroughput: (4 * 1024 * 1024) / 8,
  uploadThroughput: (4 * 1024 * 1024) / 8,
});
```

That run is what exposed a loader timing its own floor from hydration instead of
from navigation start — invisible locally, a doubled wait on a real connection.

---

## 9. What to hand back to the human

Two things, every time.

**What you measured.** Not "matched the design" — the actual trace, the actual
box, the actual byte count. It is the only way they can audit you, and it is
what makes the next request cheap because the numbers are already on the table.

**What the numbers could not settle.** Keep a running list and re-surface it,
because these are decisions that are genuinely theirs, not yours:

- assets that do not exist and that you drew yourself;
- links with no destination;
- content the design implies but does not supply (this project had four named
  testimonials and no portraits — initials stood in, because reusing one stock
  photo across four different people would read as fabricated);
- places the live site looks wrong and you copied it faithfully;
- scope you knowingly did not cover.

---

## 10. The phone variant

Mobile is no longer a `zoom` ladder. It is a real reflow at `max-width: 810px`,
measured off the same live site at a 390×844 viewport.

**What the breakpoint sweep found.** The designer's Framer file carries exactly
one media query — `(max-width: 1439.98px)` — so there is no tablet variant and
everything below 1440 gets the phone layout. Following that literally hands a
1366 laptop the phone layout stretched full width, which on the live site
renders as white-on-white with the headline invisible. So the phone layout is
scoped to ≤810 here and the zoom ladder (0.67, then 0.53 below 965) covers the
band above it. That is a deliberate divergence, not an oversight.

**Where the numbers live.** Most phone values are custom properties in
`globals.css` rather than `mob:` classes, because the components carry them in
inline `style` objects and an inline style outranks a media query. The rule of
thumb: if the value is in a `className`, use `mob:`; if it is in `style`, it
needs a variable. `help.tsx` takes this furthest — each bubble emits both
coordinate sets as `--d-*` / `--m-*` and the stylesheet picks.

**Three sections the designer never adapted.** The CTA, the footer and the menu
overlay keep their desktop composition below 1440 on the live site and clip it
("…to Move Your M…", "…ommunities to…", "LINQ BU…"). Those three are rebuilt
here as extrapolations from the ratios the designer *did* use — heading 64 → 25,
subtitle 32 → 12, buttons 220×54 → 172×42, panel frame 0.2906 — and every one of
them says so in a comment. Do not treat their numbers as measurements.

**Phone-specific traps that cost time here.**

- **The word-cycler is not a cycler on the phone.** It is a static stack with all
  four action words visible. The scroll targets are `display:none` and the
  per-word opacity/translate ride on custom properties so the media query can
  beat the inline style.
- **`white-space: pre` plus NBSP makes wrapping impossible.** `ScatterText` used
  both, so the phone headline could not break where live breaks it. Fixed by
  grouping characters into `nowrap` word spans with a real space between them —
  because every character being its own `inline-block` otherwise lets the browser
  break *between any two glyphs* ("A SMARTER W / AY TO").
- **The phone headline is expanded, not condensed**, despite Framer naming the
  face "Mozilla Headline SemiCondensed". Measured against live word widths at
  45px, the width axis is 112.5%, against desktop's 87.5%.
- **Measure the rendered extent, not a clone.** Cloning a `ScatterText` node to
  measure it silently loses the loaded face and returns fallback metrics. A
  `Range` over the live node, or the element's own box height in line-heights,
  is the trustworthy signal.
- **Centre the slot, not the card.** In the testimonial rail the phone slot is
  356×398 inside a 532-tall row; every rail offset is measured from the *slot*
  top. Centring the card inside the row instead drops the rail 67px clear of the
  ring it is supposed to thread through — and it still looks plausible until you
  compare the ring.
- **Feature-card size deltas are usually animation phase.** A card sampled at 5°
  of its wobble measures ~9px wider than the same card at 3°. Solve the rotation
  out of the bounding box before concluding anything is wrong.

Never let one of these quietly become a decision you made on their behalf.
