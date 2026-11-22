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

## Structure

- `index.html` — single landing page: hero + 3D viewer, problem timeline, four phases, engineering, steps, specs, reserve form, FAQ, footer.
- `src/main.js` — nav, reveal animations, lazy-loads viewer, order form submission.
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

## Next steps

- Replace/create the requested image only if the user supplies it as a file in the project.
- Final submission: when done, exit OpenCode and run `py submit.py` in this folder, then confirm with yes.
