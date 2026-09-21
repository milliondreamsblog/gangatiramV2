# Bricx mobile implementation handoff

Prepared 20 September 2026; live audit updated 21 September 2026. **Status: Figma and `https://bricxlabs.com/` mobile audit complete. The source repository is still unavailable, so code locators use exported component names and exact production class signatures.**

The supplied URL selects the entire `577:7040` homepage canvas, not an individual mobile screen. It contains one page and many iterations, including archived designs and product mockups. I found mobile references for the client-logo grid and portfolio; I did not identify a complete approved mobile homepage. Do not represent the recommendations for other sections as designer-specified measurements or confirmed website defects.

The active workspace is `gangatiramV2`, whose README and homepage identify it as Ganga Tiram. Its similarly named Bricx components are unrelated to the audited site. Do not modify this application's production code based on this handoff. Apply the plan in the source repository that deploys `https://bricxlabs.com/`.

## Start here: prompt for the implementing model

> Optimize the `https://bricxlabs.com/` homepage for mobile using this document, the two Figma images in `figma/`, and the baseline artifacts in `live/`. Work in the repository that deploys the live site; this Ganga Tiram workspace is not that repository. Read its AGENTS.md and map the production signatures below to source files with ripgrep. Implement P0 first: trap focus inside the open mobile navigation while preserving Escape, focus restoration, panel scrolling, and scroll locking. Then implement P1: make `TrustedBy` match Figma's 16px gutters/gaps, approximately 170 × 112px phone tiles, 8px radius, and visible mobile “And many more” card while preserving the approved live logo list and popovers. Change `Showcase` phone gutters from 20px to 16px; keep its existing `361/258` media ratio, 12px caption spacing, 32px card gaps, content, and links. Increase the header home-link hit area without enlarging its artwork. Preserve approved copy, assets, behavior, tablet/desktop layouts, and reduced-motion behavior. Do not paste generated Figma code wholesale, use expiring asset URLs, replace the current client list with an older Figma iteration, or hide overflow to conceal layout defects. Run the repository checks and repeat the viewport/interaction matrix. Return changed file references, before/after screenshots, and unresolved deviations.

## Reference index

All links use file key `JWH9gkC5IwiwVpM3TNA4Ol`. Colon-form IDs below are accepted by Figma tools; links use hyphens.

| Reference | Frame ID / link | Use |
| --- | --- | --- |
| Homepage canvas | [577:7040](https://www.figma.com/design/JWH9gkC5IwiwVpM3TNA4Ol/Bricx-Website-v7?node-id=577-7040) | Orientation only; enormous response if fetched wholesale. |
| Assembled desktop homepage, 1440 × 8005.42 | [581:10124](https://www.figma.com/design/JWH9gkC5IwiwVpM3TNA4Ol/Bricx-Website-v7?node-id=581-10124) | Desktop comparison candidate; not proof that every section is the final approved version. |
| Mobile client logos, 390 × 900.42 | [3787:5266](https://www.figma.com/design/JWH9gkC5IwiwVpM3TNA4Ol/Bricx-Website-v7?node-id=3787-5266) | Recommended layout reference: distinct client logos in two columns. |
| Alternative mobile logos | [3789:5534](https://www.figma.com/design/JWH9gkC5IwiwVpM3TNA4Ol/Bricx-Website-v7?node-id=3789-5534) | Similar dimensions; contains a hidden desktop-width row. Do not render hidden content. |
| Experimental logo variant | [3789:5406](https://www.figma.com/design/JWH9gkC5IwiwVpM3TNA4Ol/Bricx-Website-v7?node-id=3789-5406) | Repeated Writesonic logos, inconsistent rows, and right-edge clipping. Do not use as the production content source. |
| Mobile portfolio, 393 × 1458 | [2517:20875](https://www.figma.com/design/JWH9gkC5IwiwVpM3TNA4Ol/Bricx-Website-v7?node-id=2517-20875) | Main mobile portfolio reference; four stacked cards. |
| Portfolio section interior | [2517:22606](https://www.figma.com/design/JWH9gkC5IwiwVpM3TNA4Ol/Bricx-Website-v7?node-id=2517-22606) | Layout and section spacing. |
| First portfolio card | [2517:23084](https://www.figma.com/design/JWH9gkC5IwiwVpM3TNA4Ol/Bricx-Website-v7?node-id=2517-23084) | Fetch this instead of the whole portfolio if detailed context is needed. |
| First card image | [2517:22612](https://www.figma.com/design/JWH9gkC5IwiwVpM3TNA4Ol/Bricx-Website-v7?node-id=2517-22612) | Isolated image/crop reference. |
| First card caption | [2517:22617](https://www.figma.com/design/JWH9gkC5IwiwVpM3TNA4Ol/Bricx-Website-v7?node-id=2517-22617) | Verified typography and logo spacing. |
| Other card images | [Digit 2517:22638](https://www.figma.com/design/JWH9gkC5IwiwVpM3TNA4Ol/Bricx-Website-v7?node-id=2517-22638), [Thrust 2517:22828](https://www.figma.com/design/JWH9gkC5IwiwVpM3TNA4Ol/Bricx-Website-v7?node-id=2517-22828), [Camb AI 2517:22870](https://www.figma.com/design/JWH9gkC5IwiwVpM3TNA4Ol/Bricx-Website-v7?node-id=2517-22870) | Export only if the correct repository lacks equivalent approved images. |

Downloaded, visually inspected reference images:

- [Client-logo grid](figma/trusted-by-mobile-3787-5266.png), 28,251 bytes.
- [Portfolio](figma/portfolio-mobile-2517-20875.png), 123,064 bytes. This export looks dimmed against the canvas; use it for composition, not as proof of the intended page background or opacity. Inspect fills/ancestor opacity before copying colors. Caption context explicitly gives dark text.

## Measured mobile requirements

### A. Client-logo section

Observed in `3787:5266`:

- Reference viewport/frame width: 390px; section padding: 16px; available grid width: 358px.
- Two columns and five rows; 16px row/column gaps; tiles nominally 170 × 112px, radius 8px, fill `#FAFAFA`.
- Caption precedes the grid. Caption box is approximately 216.67 × 110.21px with 24px internal padding. Text: 14px, 1.4 line-height, `#808080`, Neue Haas Grotesk Display Pro 55 Roman in Figma.
- Grid starts approximately 138.21px from the section top. The trailing “And many more” box begins at y=774.21 and is approximately 216.67 × 110.21px with a light border.
- Logo sequence in this reference: Writesonic, Hobbes, Gigamind, digit, Procol, ltv.ai, Manyreach, Sybill, CAMB.AI, Kearney. Confirm approved current content before changing the site's client list.
- Small corner diamond decorations are local to each tile. Logos have their own proportions and opacity treatment; do not normalize their intrinsic artwork to stretched full-tile dimensions.

Implementation:

1. Locate the actual client-logo component and existing logo data/assets. Replace a desktop-only or non-wrapping layout on small screens if present.
2. Use `grid-template-columns: repeat(2, minmax(0, 1fr))`, `gap: 16px`, and `min-width: 0` on children. Use fluid tile width. At 390px this yields 171px columns, versus the Figma nominal 170px tiles and 2px unused space; accept that one-pixel adaptation for equal gutters. Do not hardcode a 390px section or 170px minimum width.
3. Keep approximately 112px tile height at the reference width; ensure logos fit at 320px. Constrain artwork with `max-width: 100%`, explicit proportional dimensions, and `object-fit: contain`. Reduce internal padding where required at narrow widths instead of clipping artwork.
4. Anchor decorations with `top`/`right` within each tile, not Figma's absolute page coordinates.
5. Keep the trailing caption fluid with a maximum width if retaining its measured visual size. Do not use the entire 900px frame height as a CSS fixed height.
6. The two-column static grid is evidenced. A carousel, marquee, collapse control, or different logo ordering would be a separate product decision.

Acceptance: two readable columns at 320–430px, every approved logo visible, no accidental page overflow, no stretched art, matching gaps/radius at 390px. Decorative marks do not become empty focusable controls.

### B. Portfolio section

Observed in `2517:20875`:

- Reference width 393px; 16px section gutters; 361px content width.
- Header wrapper x=16, y=16, width=361, height=54px. Heading bounds are 306 × 30px, offset y=12 inside that wrapper. This is a measured text box, not a verified font size.
- Card stack starts at x=16, y=94. Four 361 × 313px cards are separated by 32px.
- Every image is 361 × 258px. Caption starts 12px below the image, at card-local y=270; nominal caption height is 43px.
- Cards start at y=94, 439, 784, and 1129. Section bottom padding is 16px.
- The caption is outside/below the image. The first uses a 40 × 40px rounded logo block, 10px logo-to-text gap, and 4px between title and subtitle.
- First title: Suisse Intl Medium, 18px, line-height 1.2, letter-spacing -0.36px, `#262626`. Subtitle: Suisse Intl Regular, 16px, line-height 1.08, letter-spacing -0.64px, `rgba(38,38,38,0.6)`.
- The reference shows Hobbes, Digit, Thrust, Camb AI. Content is evidence of the design iteration; preserve current approved cases if they differ.
- Main desktop candidate uses two columns with 674 × 622px cards and over-image caption groups. The mobile reference explicitly changes both composition and aspect ratio.

Implementation:

1. Map portfolio rendering and data to the correct files. Use one card column on phones and preserve the desktop arrangement at its established breakpoint.
2. Set image-container `aspect-ratio: 361 / 258`, width 100%, and local clipping/radius. Keep the caption in normal document flow below it on mobile. At 320px, the available 288px image width produces approximately 206px height; the whole card must grow naturally for wrapped captions.
3. Reuse one semantic card/link where possible. Change its layout with responsive CSS; avoid duplicated links or duplicate screen-reader content for desktop/mobile versions.
4. Match each image's composition. A desktop asset may require a different crop, `object-position`, or a mobile export. Do not globally apply `object-fit: cover` without comparing all four crops.
5. Keep 32px inter-card spacing and 12px image-to-caption spacing. Use `min-width: 0` and wrapping for longer real project names. Avoid fixed overall card heights that clip text at 200% zoom.
6. Reuse existing licensed fonts and tokens. The frame mixes type families; do not download unlicensed fonts or add multiple new families solely to reproduce an experimental reference.
7. Preserve usable case-study links. The first mobile caption has no desktop corner-arrow control; do not invent a tiny separate touch target to preserve that desktop decoration.

Acceptance: at 393px, 16px gutters, 361 × 258px image boxes, captions below images, 12px caption separation and 32px between cards. At narrower widths, no clipping or overlap, all text readable, correct links reachable by touch and keyboard.

## Verified live-site audit

Audited URL: `https://bricxlabs.com/` on 21 September 2026. The live site is a Next.js/Tailwind application. Chromium captures were taken at 320 x 740, 360 x 800, 390 x 844, 393 x 852, 430 x 932, 768 x 1024, 1024 x 768, and 1440 x 900 with reduced motion enabled. The repository that deploys the site was not found in this workspace, nearby projects, connected GitHub code search, or public GitHub search.

Baseline evidence is in [live](live/):

- `summary.json` and one JSON diagnostics file per viewport.
- Selected top-of-page captures cover the 320px phone, 390px phone, and 1440px desktop baselines; per-viewport JSON retains measurements for all eight sizes.
- `390x844-scroll/` contains real viewport captures taken while scrolling the services and lazy-loaded work-sample sections.
- `390x844-interactions/menu-open.png` and `client-dialog.png` record the open navigation and client popover.
- `capture-live.cjs` is repeatable audit tooling; it is not an application dependency.

### P0: mobile navigation lets focus escape behind the modal

At 390 x 844, the navigation has a modal dialog role, accessible name, scroll locking, Escape dismissal, and focus restoration. Keyboard focus is not contained. On the 18th Tab press, focus moved to the background Clutch badge while the menu remained expanded; later Tab presses reached the background hero CTAs.

Find the source by searching for `Site navigation` or:

```text
fixed inset-x-0 z-30 px-5 md:hidden
scrollbar-none mx-auto w-full overflow-x-hidden overflow-y-auto
```

The deployed code is in `/_next/static/chunks/3-lat69oba15r.js`. Use its signature to find the source; do not edit the bundle.

Fix this with the project's focus-scope/dialog primitive, or contain Tab and Shift+Tab inside the panel. Mark the page behind it inert. Preserve scroll locking, Escape, focus restoration, panel scrolling, and `data-lenis-prevent`. Test forward/reverse focus cycling and Escape restoration.

### P1: `TrustedBy` does not match the mobile Figma proportions

At 393px, the live section uses 20px horizontal/56px vertical padding, a 353px grid, 12px gaps, and 170.5 x 86.72px tiles with 10px radius. The mobile `And many more` item is hidden. Figma specifies 16px outer padding, 16px gaps, approximately 170 x 112px tiles with 8px radius, a separate caption box, and a visible trailing box. Preserve the newer live logo list.

Search source for exported component `TrustedBy` or:

```text
bg-white px-5 py-14 md:px-10
grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6
group relative aspect-[173/88] bg-surface p-4
hidden aspect-[173/88] items-center
```

The deployed code is in `/_next/static/chunks/1gu0-r6-pguw5.js`.

Fix phone styles with 16px gutters/gaps, approximately 112px tile height at the 390px reference width, and 8px radius. Keep widths fluid at 320-430px. Render `And many more` as a separate visible phone box matching Figma; do not replace a client logo. Preserve logo data, proportional sizing, lazy loading, grayscale treatment, popovers, and tablet/desktop grids. The current popover fits at 390px and Escape closes it; retest placement after changing tile height.

### P1: `Showcase` only needs the Figma phone gutter

At 393px, the live content starts at x=20px and is 353px wide. Cards are one column with 32px gaps; the first is 353 x 307.28px. Media already uses the correct `361/258` ratio and captions use normal flow with 12px top spacing. Figma specifies x=16px, width=361px, media 361 x 258px, and about 313px total card height.

Search source for exported component `Showcase` or:

```text
group relative flex flex-col md:aspect-[674/622]
relative aspect-[361/258] w-full
mt-3 flex items-center justify-between
grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-3
bg-white px-5 py-16 md:px-10 md:py-24
```

The deployed code is in `/_next/static/chunks/2nb9o8ke-wn0i.js`.

Change only the base horizontal section padding from 20px to 16px and keep `md:px-10`. At 393px this naturally produces the Figma media and card dimensions. Preserve the current heading, cases, assets, media ratio, captions, links, 32px gaps, and desktop behavior.

### P2: enlarge the mobile home-link hit area

The `Bricx home` link measures 22 x 20px at 390px. Give it an approximately 44 x 44px hit area while keeping the mark 22 x 20px. The WhatsApp, call, and menu controls are already 44px high. Verify the larger link does not overlap them at 320px.

### Verified passes and non-issues

- All eight viewports returned HTTP 200 with correct viewport metadata. No document-level horizontal overflow or broken rendered images was detected.
- The 320px hero stays readable; header controls and both hero CTAs fit without overlap.
- The client grid already uses two columns and approved logos. Its popovers fit the phone viewport.
- Portfolio already stacks four cards, uses the Figma media ratio, keeps captions below images, and uses 32px gaps.
- Services is a working phone accordion. The blank area in a single full-page screenshot is a capture artifact from animated/sticky behavior; sequential scroll captures show the content.
- The testimonial rail is horizontally contained and swipeable. FAQ cards, CTA band, team copy, work gallery, and two-column footer fit at tested widths.
- Work-sample images intentionally lazy-load. Gray boxes in the initial full-page capture are not a live defect; sequential scroll captures show all 12 images.
- No application console or page errors were recorded. Failed analytics/ad requests are unrelated to layout.

## Remaining homepage: regression guidance

The live audit found no reason to rebuild these sections. Treat this table as a regression checklist when shared layout primitives change. Items below are **not additional confirmed defects or measured mobile Figma specifications**.

| Priority / area | Desktop reference | What to inspect and how to adapt |
| --- | --- | --- |
| P0: page foundation | Entire homepage | Confirm viewport metadata, border-box sizing, loaded fonts, fluid containers, and no fixed/min widths exceeding the viewport. Establish 16px phone gutters consistent with measured frames. Fix the element causing overflow; reserve clipping for decorative artwork. |
| P0: navigation | [Services menu 3063:43314](https://www.figma.com/design/JWH9gkC5IwiwVpM3TNA4Ol/Bricx-Website-v7?node-id=3063-43314) | Desktop mega menus are 1360px wide. On touch, use a menu button and vertically scrollable panel with expandable groups; show all navigation destinations. No hover-only access. Support close, Escape, focus restoration, and background-scroll handling. Target about 44 × 44px interactive areas. This mobile behavior is proposed. |
| P0: hero / CTA | [1452:7905](https://www.figma.com/design/JWH9gkC5IwiwVpM3TNA4Ol/Bricx-Website-v7?node-id=1452-7905) | Inspect headline wrapping, button overlap, visual crop, and fixed 900px heights. Use a fluid type scale, normal-flow text, wrapping/stacked CTAs, and a separate bounded visual. Remove desktop-only hard line breaks when they create poor phone wraps. Keep the primary action reachable and readable. |
| P1: services | [581:12287](https://www.figma.com/design/JWH9gkC5IwiwVpM3TNA4Ol/Bricx-Website-v7?node-id=581-12287) | Stack section title/description. Convert wide title-description-artwork rows into full-width stacked items; keep all service destinations available without hover. If existing accordion behavior is retained, use proper buttons and expanded state. Size media proportionally rather than preserving desktop fixed heights. |
| P1: testimonials | [581:11103](https://www.figma.com/design/JWH9gkC5IwiwVpM3TNA4Ol/Bricx-Website-v7?node-id=581-11103) | Fit quotes and attribution to the viewport. Prefer stacked cards; if the current design intentionally uses a carousel, retain it with swipe and visible controls, local horizontal overflow, and no truncated quote text. Do not add autoplay as part of responsive cleanup. |
| P1: promotional band | [3727:4782](https://www.figma.com/design/JWH9gkC5IwiwVpM3TNA4Ol/Bricx-Website-v7?node-id=3727-4782) | Stack text/action and visual. This desktop frame contains placeholder copy; preserve approved website copy. Check that artwork cannot cover the action or force a desktop-width container. |
| P1: about/team | [2404:14882](https://www.figma.com/design/JWH9gkC5IwiwVpM3TNA4Ol/Bricx-Website-v7?node-id=2404-14882) | Stack the desktop columns, keep paragraphs at readable measure, allow image height to follow its aspect ratio, and avoid scroll-pinned desktop effects that consume excessive phone scroll distance. |
| P1: FAQ | [581:11201](https://www.figma.com/design/JWH9gkC5IwiwVpM3TNA4Ol/Bricx-Website-v7?node-id=581-11201) | Put heading above the questions. Make each trigger full width, let the question wrap, and keep the icon non-shrinking. Answers expand in normal flow. Verify long content and keyboard activation. |
| P1: footer | [1563:4472](https://www.figma.com/design/JWH9gkC5IwiwVpM3TNA4Ol/Bricx-Website-v7?node-id=1563-4472) | Wrap email/tagline without overflow, use one or two link columns according to content, and preserve legal/social links. If the site has the illustrated game/interactive footer, bound its canvas to its container and verify it does not intercept normal page scrolling. |
| P2: media / motion | Relevant section frames | Provide accurate responsive image `sizes`, reserve image dimensions, lazy-load below-fold images, and prioritize only the actual hero/LCP image. Honor reduced motion and avoid running offscreen decorative animations. Measure changes rather than inventing performance scores. |

## Work sequence and source mapping

1. **Open the correct repository:** it must deploy `https://bricxlabs.com/`. Record branch/commit and confirm the deployment matches. Read its AGENTS.md.
2. **Map source:** use the exported names and exact class signatures above to locate navigation, `TrustedBy`, `Showcase`, and the header link. Do not edit production bundles or this Ganga Tiram application.
3. **Fix P0 first:** contain menu focus and make the background inert without breaking panel scroll, Escape, focus restoration, or Lenis behavior.
4. **Implement measured P1 changes:** adjust `TrustedBy` phone geometry and `Showcase` phone gutter. Reuse current content and assets.
5. **Implement P2:** enlarge the header home-link hit area.
6. **Verify:** run the target repository's lint/type/build checks, a menu focus interaction test, and the viewport matrix below. Compare against `live/`.
7. **Hand off:** provide before/after screenshots, changed source paths and lines, validation results, and deliberate Figma deviations.

Verified issue ledger:

| ID | Route + viewport | Observed problem + screenshot | Component/CSS path and line | Figma requirement or proposed behavior | Fix | Verification |
| --- | --- | --- | --- | --- | --- | --- |
| NAV-01 | `/`, 390 × 844, menu open | Tab escapes to the background on step 18 while the menu stays open; see `live/390x844-interactions/menu-open.png` | Search `Site navigation`; deployed chunk `3-lat69oba15r.js` | P0 accessibility behavior | Add focus containment and background inertness | Forward/reverse focus cycle; Escape restores trigger |
| LOGO-01 | `/`, 393 × 852 | Live tiles 170.5 × 86.72, 12px gaps, 20px gutters; mobile trailing card hidden | Export `TrustedBy`; deployed chunk `1gu0-r6-pguw5.js` | Figma `3787:5266` | 16px gutters/gaps, ~112px height, 8px radius, visible trailing card | Section overlay at 390px plus 320–430px checks |
| WORK-01 | `/`, 393 × 852 | Live x=20/content=353; internal card composition already correct | Export `Showcase`; deployed chunk `2nb9o8ke-wn0i.js` | Figma `2517:20875` | Base section gutter 20px → 16px | 361 × 258 media and ~361 × 313 card |
| NAV-02 | `/`, 390 × 844 | Home-link target is 22 × 20px | Search accessible name `Bricx home` | Proposed usability improvement | ~44px target; artwork remains 22 × 20 | No overlap at 320px |

Fill source file paths and line numbers after opening the correct repository; the locators above are exact enough to find each component quickly.

## Asset and token-efficient workflow

- Send this document and the `figma/` folder to the next model. The two saved PNGs total about 151KB; they are reference screenshots, not production section images.
- Do not re-fetch metadata or generated code for the whole `577:7040` canvas. Its metadata alone is extremely large. Read this index and request only the section/card being changed.
- Reuse equivalent existing logos, screenshots, portraits, and fonts before exporting anything. Responsive rearrangement often needs no new production assets.
- For missing imagery, call `get_design_context` for a specific image/card node with the Figma design-to-code skill loaded. Or export the isolated asset using `download_assets`, then immediately save the returned bytes into the correct project's asset directory and record the source frame ID.
- Do not embed a whole card or section as a bitmap: keep text, links, and controls as accessible HTML. Export artwork only.
- The full portfolio context request timed out (HTTP 504); the smaller caption request succeeded. Use smaller card/image nodes instead of retrying the entire subtree repeatedly.
- `download_assets` may cap source-image/vector lists at 20 entries. A successful whole-frame render does not prove a complete asset inventory. Narrow to an individual missing logo/artwork node when needed.
- Expiring Figma asset URLs are not stable handoff references. Use the permanent frame links in this document and committed/local asset files.

## Acceptance matrix

Test at 320 × 740, 360 × 800, 390 × 844, 393 × 852, 430 × 932, 768 × 1024, 1024 × 768, and 1440 × 900. The first two Figma sections have exact reference widths of 390 and 393; other widths test responsive behavior.

- No unintended document-level horizontal scrolling, including with menus open and FAQs expanded. Inspect overflow causes rather than accepting `overflow-x: hidden` on the page as a fix.
- Navigation destinations, primary/secondary CTAs, project links, and footer links work. Hover is never the only way to expose essential content.
- Menu opens/closes reliably and restores focus. Check scrolling and viewport resizing while it is open.
- Long headings, project names, emails, and expanded FAQ answers wrap without clipping; text remains usable at 200% zoom.
- Correct image composition, no distortion, no broken image requests, no loading-induced section jumps.
- Logo and portfolio measurements above match at the reference widths; use side-by-side section screenshots and overlays when useful.
- Desktop at 1440px remains visually consistent with the pre-change baseline. Check intermediate widths for half-mobile/half-desktop layouts.
- Test mobile Chromium and WebKit/iOS behavior where available. State explicitly if only emulation was tested; do not claim physical-device validation.
- Respect reduced motion. Touch scrolling remains usable around carousels, artwork, and any footer canvas.
- Deliver screenshots named by route, section, width, and before/after state; list passed checks and unresolved deviations.

## Input still needed to implement

The repository/path that deploys `https://bricxlabs.com/`. The visual and interaction audit is complete; no Figma rediscovery or new baseline capture is needed. Once the repository is available, map the exact signatures above to source paths, implement the four ledger items, run project checks, and capture the after state.

Source-location checks completed on 21 September 2026:

- The accessible private repository `milliondreamsblog/Bricx` is empty and has no deployable source.
- The connected Vercel account contains only the `Akshat's projects` team, which does not own the `bricxlabs.com` domain.
- Exact GitHub searches for the deployed navigation, `TrustedBy`, and `Showcase` class signatures returned no accessible source repository.
- The similarly structured files in `gangatiramV2`, `Arthenic`, and `elvyn-site` are separate products or template descendants. They must not be patched as substitutes for the Bricx production source.
