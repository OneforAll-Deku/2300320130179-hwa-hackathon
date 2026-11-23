# PawClock™ — 4-Phase Chrono-Feeder

**Lick → Play → Chew → Settle.** A mechanical, app-free enrichment sequence for the two-hour home-alone curve.

**Live site:** https://2300320130179-hwa-hackathon.vercel.app  
**Detailed 3D viewer:** https://2300320130179-hwa-hackathon.vercel.app/pawclock-3d-model.html  
**GitHub repo:** https://github.com/OneforAll-Deku/2300320130179-hwa-hackathon

---

## What PawClock is

PawClock is a concept 4-phase chrono-feeder that turns the first two hours of home-alone into an enrichment ritual for dogs — no app, no batteries, no login, no subscription.

The idea: the first two hours after the door clicks shut are the hardest for many dogs. PawClock meets that curve with natural calming behaviours in order — licking, scent work, chewing, rest — so your dog stays engaged, calm, and cared for until you come back.

---

## The four phases

| Phase | Name | Module | Time | What it does |
|-------|------|--------|------|--------------|
| 01 | Lick | Frozen lick-well bowl | 20–30 min | Slow, rhythmic licking is a natural self-soother. Fill, freeze, clip on for the first stretch. |
| 02 | Play | Maze ball food dispenser | 15–20 min | Treats hide inside a rolling maze ball, turning pacing into focused foraging; also works as a dog toy. |
| 03 | Chew | Dental-chew core | 20–30 min | Textured ring redirects stress into healthy chewing, massaging gums with a treat reward. |
| 04 | Settle | Weighted chrono base | 60 min | A 1.4 kg base keeps modules steady while a mechanical timer counts down the final stretch; pairs with a calming scent routine. |

Each phase card links to `#reserve`, and the 3D viewer under the hero highlights each phase's modules with per-part hover tooltips and click-to-phase scrolling.

---

## Pricing & how to buy

PawClock is sold direct-to-consumer as a concept product study in small batches. Reservations are **free and refundable** — no payment is taken today, and final timing/specs/shipping are confirmed before any charge.

You can buy **individual phases separately** or combine all four into **one set**:

| Item | Price (INR) |
|------|-------------|
| Phase 01 · Lick — Frozen lick module | ₹8,999 |
| Phase 02 · Play — Maze ball food dispenser | ₹9,999 |
| Phase 03 · Chew — Dental-chew module | ₹8,999 |
| Phase 04 · Settle — Weighted chrono base | ₹9,999 |
| **Full set — all four phases in one kit** | **₹34,999** *(saves ₹3,000 vs separate total of ₹37,998)* |

### Companion dog products

The Buy section also carries refills, spares and accessories designed around the ritual:

| Item | Price (INR) |
|------|-------------|
| Broth Pods 8-pack (refill, pairs with Phase 01) | ₹699 |
| Calming Chews jar (refill, pairs with Phase 04) | ₹599 |
| Replacement chew core (spare part, Phase 03) | ₹1,299 |
| Travel & storage pouch (accessory) | ₹1,499 |

Each product has a procedurally drawn brand-palette SVG render in `public/images/` (`product-broth-pods.svg`, `product-calming-chews.svg`, `product-chew-core.svg`, `product-travel-pouch.svg`).

Reserve via the form at the bottom of the page (name, email, quantity 1–3). On success you receive a reservation code such as `PC-XXXXXX`.

## Product configurator

Before reserving, use the **Build your PawClock** configurator to tailor your order:

- **Colorway picker:** Choose Teal (`#008296`), Cyan (`#0abfd7`), or Warm Peach (`#eaf7fb`). The live swatch preview updates instantly.
- **Refill subscriptions (optional, monthly):**
  - Broth Pods — savoury frozen broth drops for the lick well, ₹599/month
  - Calming Chews — gentle chews to support the settle phase, ₹499/month
- **Live total:** PawClock full set ₹34,999 (one-time) plus selected monthly refills. Your colorway and refill choices are carried over to the reservation form as hidden fields.

Click **Reserve this configuration** to jump to the reservation form with your selections noted.

## Botanical Scent Apothecary

Inside **Phase 04 · Settle** is an interactive "Botanical Scent Apothecary" card. Toggle between four calming scents (Lavender, Valerian Root, Ginger, Roman Chamomile) to see each one's botanical name and primary calming benefit. A prominent red alert box highlights toxic essential oils to avoid (Tea tree, eucalyptus, citrus, pine, clove, wintergreen, pennyroyal) with veterinary safety advice: dilute scents, diffuse 10–15 minutes in a ventilated room, use pet-safe products, always let your dog leave if they want, and consult your vet before introducing new aromas.

---

## Order endpoint

**`POST /api/order`** — Vercel serverless function (also mirrored by Vite dev middleware locally).

Validates name (≥2 chars), email, and quantity (integer 1–3), then returns `201` with a reservation code like `PC-XXXXXX`. Honeypot field blocks simple bots.

Example success body:
```json
{
  "ok": true,
  "orderId": "PC-3S20HZ2IY",
  "quantity": 1,
  "message": "Reservation received"
}
```

---

## Tech stack

- **Vite + vanilla JavaScript** (ES modules)
- **Three.js** ^0.187.0 — GLB loading, orbit controls, per-part material recolor, raycast hover/tooltips, phase highlighting
- **Custom CSS** — design system, responsive layout, reveal animations, smooth scroll
- **Vercel serverless function** — `api/order.js` order endpoint

## Masked Heading component

**`src/ui/MaskedHeading.js`** — vanilla JS component for a text-masked heading that reveals a metallic gradient (or optional background video) through the letters.

- Accepts a headline string + target element
- CSS `background-clip: text` mask with animated metallic gradient
- Cursor-following spotlight effect over the letters
- Subtle 1px brass (`#b98a3c`) outline via `-webkit-text-stroke` so text stays readable over bright or dark frames
- Fully responsive with `text-wrap: balance`
- Honors `prefers-reduced-motion` (disables spotlight and gradient animation)

Used on the **The ritual** section heading ("Four phases, one quiet countdown.").

### Repository structure

```
index.html          # Single landing page: hero + 3D viewer, ritual curve, four phases, engineering, specs, buy, reserve, FAQ, footer
src/main.js         # Nav, reveal animations, lazy viewer load, order form submission, back-to-top, MaskedHeading mount
src/ui/MaskedHeading.js  # Text-masked heading with brass stroke, metallic gradient reveal, cursor spotlight
src/ui/SpotlightCard.js # Cursor-tracking brass sheen spotlight overlay for phase and buy cards
src/viewer.js       # Three.js scene, GLB load, per-mesh materials, part hover/tooltips, phase chips, click-to-phase
src/styles/main.css # Design system and responsive layout
api/order.js        # Vercel order endpoint validation
vite.config.js      # Vite dev server + /api/order middleware mirror
public/             # Deployable static assets (model, images, favicon, detailed 3D viewer)
public/pawclock-3d-model.html  # Detailed procedural Three.js studio viewer
design/             # Presentation/source visuals (not deployed)
AGENTS.md           # Project memory and progress
```

---

## Local development

Requires Node.js.

```bash
# install dependencies
npm install

# start dev server with local /api/order mirror
npm run dev   # http://localhost:5173

# production build
npm run build

# preview production build locally
npm run preview
```

---

## Deployment

Deploy to Vercel (production alias):

```bash
vercel --prod --yes
```

The canonical public address to share is:

**https://2300320130179-hwa-hackathon.vercel.app**

Only share this address — not the per-deploy preview URL that asks visitors to sign in to Vercel.

---

## Quick links

- Live site: https://2300320130179-hwa-hackathon.vercel.app
- Detailed 3D model viewer: https://2300320130179-hwa-hackathon.vercel.app/pawclock-3d-model.html
- GitHub repo: https://github.com/OneforAll-Deku/2300320130179-hwa-hackathon
- Calming-scent reference (Phase 04): https://a-z-animals.com/articles/these-are-9-scents-that-calm-anxious-dogs/

---

## Key notes

- PawClock is a **concept product study**. Specifications are design targets; imagery is concept renders.
- **No app, no batteries, no alerts** — the chrono base is fully mechanical.
- Modules are food-grade silicone, stainless steel, machined brass, and BPA-free polymer; top-rack dishwasher-safe modules, hand-wash the brass base.
- Individual modules can be purchased separately or together as the four-part set.
- The site is public, open to everyone, with a working order endpoint — no login required.
