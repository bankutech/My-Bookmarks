# Nexus Portal

Nexus Portal is my personal bookmark dashboard — the page my browser opens to. Instead of digging through a browser bookmark bar with 60+ entries, I open one page that shows everything I use day to day: university portals, dev tools, AI assistants, learning platforms, online compilers, documentation, utilities, and my own deployed projects.

It is a single static page. No framework, no build step, no backend, no accounts. You open `index.html` and it works.

## Why I built it

My browser bookmark bar had become an unsorted pile, and most "start page" products want an account, a subscription, or a sync service for something that is fundamentally a local problem. I wanted a workspace that loads instantly, keeps my data in my browser, and looks like something I designed rather than a template. The 3D cards are also a deliberate excuse to build something tactile with plain CSS — the flip and tilt are hand-rolled with `perspective`, `transform-style`, and `backface-visibility`, not a library.

## Features

- **8 categories, ~60 bookmarks** — Academic Resources, Development & Tools, Video Learning, Learning Platforms, Online Compilers, Docs & References, Utilities & Others, and My Active Projects.
- **3D bookmark cards** — cards tilt toward your cursor (max 8°), with a soft glare that follows the pointer. Hover (or click) flips a card to its back, which holds the URL plus Visit / Edit / Delete actions.
- **Live search** — filters across title, description, and domain, with `<mark>` highlighting on matches. Categories with no matches hide themselves; an empty state appears when nothing matches.
- **Full CRUD** — add, edit, and delete bookmarks through a modal (FAB bottom-right, or the edit button on a card back). Edit works by moving a bookmark between categories, not just renaming in place.
- **Live clock and greeting** — a tabular-numeral clock that can't cause layout shift, plus a time-based greeting (morning / afternoon / evening / night) with a short text-scramble reveal.
- **Keyboard and touch support** — every action works without a mouse; on touch devices the tilt and hover-flip are replaced by tap-to-flip.

## Design philosophy

The visual language is "Pearl & Frost": pearl off-white surfaces, a few translucent frost panels, a deep slate ink accent on card backs, and one restrained blue accent. Glass is used where it creates hierarchy (the sidebar), not on every element. Shadows are layered but quiet, corners are rounded enough to feel soft but not bubbly, and metadata (domains, counts, the clock) is set in JetBrains Mono for a technical feel. The particle background is intentionally faint — dark specks at 6% opacity — so text always wins.

I deliberately avoided the usual AI-dashboard look: no giant gradient headlines, no neon glow borders, no floating blobs, no fake statistics, no "Welcome back!" SaaS framing.

## 3D interaction model

Each card is a `perspective` container with a `preserve-3d` inner wrapper and two faces (front pearl, back ink) hidden via `backface-visibility`. Pointer position maps to a restrained `rotateX`/`rotateY` (8° max) written to CSS custom properties, and a radial-gradient glare tracks the same coordinates. Flip is a 180° `rotateY` driven by hover on fine-pointer devices and by click/Enter on touch and keyboard. Everything animates on `transform` and `opacity` only.

## Technology

- HTML5, CSS3, vanilla JavaScript (ES2020-ish; uses optional chaining and `replaceAll`)
- [Font Awesome 6](https://fontawesome.com) for icons, Google Fonts (Inter + JetBrains Mono) — both from CDN
- Canvas API for the particle field
- `localStorage` for persistence

## Project structure

```
Nexus Portal/
├── index.html            # markup shell
├── styles.css            # layout, components, interactions
├── css/
│   └── design-system.css # design tokens (color, depth, radius, motion)
├── js/
│   ├── data.js           # CATEGORIES — the bookmark dataset, each entry with a unique id
│   └── scripts.js        # rendering, search, CRUD, clock, effects
└── README.md
```

## LocalStorage behavior

Two keys, both JSON:

| Key | Purpose |
| --- | --- |
| `custom_bookmarks` | `{ categoryId: [bookmark, …] }` — bookmarks you add (or move) are merged into the dataset on load |
| `hidden_bookmarks` | `[name, …]` — default bookmarks you deleted stay hidden after reload |

Consequences worth knowing:

- Data lives per-browser and per-protocol. Clearing site data resets the dashboard; opening the file from a different path or browser shows a fresh set.
- Edit and delete go by each bookmark's unique `id` (`bm-001`, `bm-custom-…`), never by URL — duplicate URLs can't collide.
- Custom bookmarks get a generated unique id at save time.
- Legacy `hidden_bookmarks` entries are matched by name for backwards compatibility.

## Running it

Open `index.html` in any modern browser, or serve the folder:

```bash
npx serve .        # or: python -m http.server
```

There is nothing to install and nothing to build.

## Limitations

- No sync — data is local to one browser profile. Back up by copying the two `localStorage` keys.
- `data.js` is the source of truth for defaults; permanent edits mean editing that file.
- Icons are manually chosen Font Awesome classes, not real favicons.
- The modal's URL validation is deliberately simple (must parse as a URL); there's no deduplication warning if you add the same URL twice.
- Legacy `hidden_bookmarks` entries are matched by name, so renaming a default bookmark in `data.js` can resurrect a hidden one.

## Improvements in this version

- Unique bookmark IDs replace URL-based identity, fixing edit/delete collisions on duplicate URLs.
- Restraint pass on effects: 8° tilt cap, faint particles, lerp-trailing cursor ring, `prefers-reduced-motion` respected (particles disabled, transitions neutralized), touch devices skip hover-only behavior entirely.
- Reworked layout: compact sidebar with live counts, tabular-numeral clock that can't shift layout, proper empty state, clear search button.
- Accessibility: semantic landmarks, labeled controls, focus-visible rings, Escape/backdrop close on the modal, `aria-modal` dialog, screen-reader labels on icon buttons.
- CSS architecture: one token sheet (`design-system.css`) with a small, named variable set; layout and components in `styles.css`. No theme-switching leftovers.
- Delegated event handling for cards, HTML-escaped rendering, `requestAnimationFrame`-gated cursor movement, and a particle loop that pauses when the tab is hidden.
