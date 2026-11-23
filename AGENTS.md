# Project memory — read this first

This file is the single source of truth for decisions and progress, so any model or session can resume the work.

## Product

- Idea: PawClock™ — a 4-phase chrono-feeder that turns the first two hours of home-alone into an enrichment ritual for dogs.
- One-line pitch: Lick, sniff, chew, settle — a mechanical, app-free enrichment sequence for the two-hour home-alone curve.
- Stack: Vite + vanilla JS + Three.js (open source), custom CSS, Vercel serverless function for orders.

## Hackathon constraints (must follow)

- Build only in this folder. Never touch `init.py`, `submit.py`, `hwa-start.*`, `opencode.json`, or `.hwa/`.
- Never print, save, or commit keys/tokens/passwords.
- Commit and push to `OneforAll-Deku/2300320130179-hwa-hackathon` as work progresses.
- Deploy with `vercel --prod`; the only public address to share is https://2300320130179-hwa-hackathon.vercel.app
- No skills, saved prompts, or templates. No closed/paid models.
- Site must stay live, public, no login, with a working order endpoint.
- No MCP servers: adding one would require editing protected config or files outside the project.

## Decisions log

- (2026-11-21) Product direction: PawClock 4-phase chrono-feeder, premium pet-tech landing page.
- (2026-11-21) Assets consolidated: one canonical `public/models/pawclock.glb`; images renamed and compressed to `public/images/`; presentation-only overview moved to `design/`.
- (2026-11-21) 3D model is an exploded four-phase assembly with unnamed nodes. Viewer centers, scales, lights and recolors it at runtime to the brand palette (deep teal, brass, cream); original GLB untouched.
- (2026-11-21) Order endpoint implemented at `POST /api/order` with validation and a reservation code; Vite dev middleware mirrors it locally.
- (2026-11-21) First production deploy is live and verified: page, model, images and live order endpoint all return 200/201.
- (2026-11-21) User asked to hold GitHub push for now; everything is local only.
- (2026-11-21) Viewer upgraded to deep part interaction: per-part hover glow + tooltip, click/tap a part scrolls to its phase card and flashes it, and four phase chips under the viewer highlight each phase's modules. Materials are cloned per mesh so highlights stay scoped; the transparent dome and internal Phase 4 parts are handled (internal parts highlight via chips).
- (2026-11-21) Part tooltips now include a short description for each module; a collapsible "Parts in the model" legend lists all eight named modules grouped by phase.
- (2026-11-22) Realism pass: dynamic key-light shadows on a soft contact plane, ACES exposure and stronger rim/fill lighting, PBR tuning per original material, clearcoat on painted polymer parts, and procedural brushed/noise roughness and bump maps. The GLB remains untouched.
- (2026-11-22) Added a procedural brass chrono dial on the lid: cream face, minute ticks, phase markers, printed brand copy, raised brass bezel, center cap and hand. It is a visual detail, not a pickable module. The hero camera was raised slightly so the dial reads at first glance.
- (2026-11-22) Kept the exploded layout with the base module separated; hiding it lost the bowl detail and attaching it visually read as a pedestal. The exploded assembly stays intentional.
- (2026-11-22) Standalone detailed 3D studio viewer integrated at `public/pawclock-3d-model.html`; landing page adds an "Explore the detailed 3D model" link and the viewer adds a back link; missing GLB export/server save and hidden auto-export removed; responsive HUD fixes applied.
- (2026-11-22) Phase content updated with YouTube/Facebook enrichment videos, Phase 04 calming-scent guide link, and an INR-priced buy-all-four-parts section.
- (2026-11-22) Phase 02 now frames the maze ball as a dog toy/food dispenser; Phase 04 calming-scent guide is read in detail; all site prices now use INR.
- (2026-11-23) Phase 02 changed to Maze ball food dispenser; Facebook video replaced with YouTube https://youtu.be/3NEa7C8JqvI; viewer module list, cutaway caption, and buy card updated.
- (2026-11-23) Interactive product configurator added: Teal/Cyan/Warm Peach colorway picker (#008296, #0abfd7, #eaf7fb) with live swatch preview, and optional refill subscriptions (Broth Pods ₹599/mo, Calming Chews ₹499/mo) with live total; selections carried to the order form as hidden fields.
- (2026-11-23) MaskedHeading component added: vanilla JS text-masked heading (`src/ui/MaskedHeading.js`) revealing a metallic gradient through the letters, cursor-following spotlight, 1px brass (#b98a3c) outline, text-wrap: balance, prefers-reduced-motion support; used on the ritual section header.
- (2026-11-23) Botanical Scent Apothecary card added to Phase 04 Settle: toggle tabs for Lavender, Valerian Root, Ginger, Roman Chamomile showing botanical name + primary calming benefit, plus a red alert box for toxic scents to avoid with veterinary safety advice.
- (2026-11-23) SpotlightCard component added: cursor-tracking brass sheen overlay (`src/ui/SpotlightCard.js`) applied to `.phase` and `.buy__card` elements; soft radial gradient `rgba(185,138,60,0.15)` follows pointer on desktop hover and fades smoothly on leave; respects prefers-reduced-motion.
- (2026-11-23) Ritual scrubber section removed; Phase 02 renamed from "Sniff" to "Play" across phase cards, viewer, buy card, and meta descriptions.
- (2026-11-23) UI polish pass: hero marquee, "Parts in the model" list, stage caption, duplicate nav Reserve link, and redundant Phase 04 scent note removed; Buy section rebuilt with full-bleed product images, phase number tags, price+CTA footer rows, and a premium full-set banner (badge, strike-through compare price ₹37,998 → ₹34,999); hero gained bottom padding after marquee removal; unused marquee/parts/nav-reserve/video-note CSS deleted.
- (2026-11-23) Buy expanded into a shop-with-accessories section: "Buy" added to navbar and footer; new "Dog products, made to pair" grid with four companion products — Broth Pods 8-pack ₹699, Calming Chews jar ₹599, Replacement chew core ₹1,299, Travel & storage pouch ₹1,499 — each with a procedurally drawn brand-palette SVG product render in `public/images/` (no text baked into art, tag pills overlay); cards gained a hover lift; full-set banner retained below.
- (2026-11-23) Rendering/animation optimization pass: hero content renders immediately (no JS-gated reveals above the fold); redundant "Load. Set. Leave." steps section and hero stat row removed; three YouTube embeds replaced with click-to-load facades using local phase photos as posters (iframes injected as youtube-nocookie on click); unified `--ease-out` token with subtler 14px reveals; nav scroll-spy active state; safer `contain: layout paint` section isolation (content-visibility was rejected because it broke anchor landing); mobile viewer DPR capped at 1.5; global reduced-motion duration override replaced with targeted handling.
- (2026-11-23) Ritual typography/UX polish: body base 17px; global `text-wrap: balance` for headings and `pretty` for prose; phase rows get dividers and generous spacing; sticky phase media on desktop (top 108px) inside a two-column start-aligned grid; phase headings tightened (clamp 1.85–2.35rem, line-height 1.1); chips and apothecary tabs restyled with 1px borders, brass active state and focus rings. Copy fixes: Phase 01/02/04 paragraphs tightened, Phase 04 heading shortened to "Weighted chrono base", curly apostrophes normalized.
- (2026-11-23) Scroll-jank fixes: nav and phase tags no longer use `backdrop-filter` (solid translucent backgrounds instead); `body overflow-x` switched from `hidden` to `clip` so sticky media works; MaskedHeading pauses its gradient animation via IntersectionObserver when offscreen; Three.js viewer skips rendering while the page is actively scrolling. SpotlightCard gained `wrapChildren: false` for open-layout cards because its wrapper collapsed the phase grid and disabled sticky. Apothecary active panel now toggles the `hidden` DOM property (the previous `hidden="false"` attribute kept every panel hidden).

## Structure

- `index.html` — single landing page: hero + 3D viewer, problem timeline, four phases, engineering, steps, specs, reserve form, FAQ, footer.
- `src/main.js` — nav, reveal animations, lazy-loads viewer, order form submission, back-to-top, MaskedHeading mount.
- `src/ui/MaskedHeading.js` — text-masked heading with brass stroke, metallic gradient reveal, cursor spotlight.
- `src/ui/SpotlightCard.js` — cursor-tracking brass sheen spotlight overlay for phase and buy cards; `wrapChildren: false` keeps open layouts (phase grid + sticky media) intact.
- `src/viewer.js` — Three.js scene, GLB loading, per-mesh material recolor, raycast part hover/tooltips, phase highlighting and click-to-phase links, orbit controls, auto-rotate, fallbacks.
- `src/styles/main.css` — design system and responsive layout.
- `api/order.js` — Vercel serverless order endpoint; shared validation also used by the Vite dev server.
- `public/` — deployable model, images, favicon.
- `public/pawclock-3d-model.html` — detailed procedural Three.js studio viewer; landing page links to it.
- `design/` — presentation/source visuals, not deployed.

## Progress / state

- Site scaffold and full first-pass landing page complete.
- Verified locally: build passes, 3D loads with no console errors, responsive at 320/390/1440, order form returns a code.
- Deployed with `vercel --prod` to https://2300320130179-hwa-hackathon.vercel.app; live form returns a reservation code.
- Deep 3D part interactions complete and verified locally: all six externally visible modules show the right tooltip, desktop hover + click-to-phase works, phase chips highlight 43/43 Phase 1 meshes, mobile tap scrolls to the hit phase, no console errors.
- Deep interactions deployed with `vercel --prod` and verified live: hover tooltip, click-to-phase scroll/flash, phase chips and `POST /api/order` (201) all work at the canonical URL; no console errors.
- Part descriptions and the "Parts in the model" legend deployed with `vercel --prod` and verified live.
- Realism pass and lid chrono dial complete and verified locally: build passes, shadows/PBR/clearcoat render, dial is crisp in top views, desktop hover and mobile tap still work, no console errors.
- Realism pass and dial deployed with `vercel --prod`; live viewer is ready with no console errors, the form returns a reservation code, and `POST /api/order` returns 201.
- Exploded base kept; comparison screenshots show hiding it removes the bowl detail and moving it lower reads as a pedestal.
- Push hold lifted: committed and pushed to `main` (commit `4b82bf9`) on 2026-11-22. The canonical Vercel deployment matches the pushed source.
- The clipboard image could not be read as a file; it was treated as a screenshot of the current viewer. No replacement image is pending unless the user supplies one.
- Detailed standalone viewer integration complete and locally verified: production build passes, detailed page loads with no console errors, interactions/steppers work, mobile layout avoids horizontal overflow, and the landing-page link navigates to the detail page with no console errors.
- Phase video, calming-scent, and INR buy-content additions complete and locally verified: build passes, phase videos and buy cards render, no console errors, no horizontal overflow.
- Phase 02 dog-toy/food-dispenser context, Phase 04 calming-scent detail, and INR-wide price updates complete and locally verified: production build passes, no console errors, no horizontal overflow.
- Phase 02 maze-ball video/content change complete: YouTube https://youtu.be/3NEa7C8JqvI replaces Facebook embed; build passes, no console errors.
- Phase 04 Settle expanded: weighted chrono base + calming scent routine copy, A-Z Animals calming-scent reference list, external guide link; build passes, no console errors.
- Phase 04 now includes the YouTube calming-scent video alongside the A-Z Animals blog link; build passes, no console errors.
- Phase 04 image reverted to phase-4-settle.jpg; full set price corrected to ₹34,999 (saves ₹3,000 vs separate modules totaling ₹37,998); FAQ covers separate-module purchase and direct-to-consumer distribution; a back-to-top button was added.
- Viewer timer updated: deprecated THREE.Clock replaced with THREE.Timer in src/viewer.js; build passes.
- Ritual polish verified locally: two-column phase grid restored with sticky media (`mediaTop 108` while the article scrolls), `#ritual` anchor lands at 100px, apothecary tab switching works and the active panel renders, no horizontal overflow at 1440/390, no console errors.

## Next steps

- Replace/create the requested image only if the user supplies it as a file in the project.
- Final submission: when done, exit OpenCode and run `py submit.py` in this folder, then confirm with yes.
