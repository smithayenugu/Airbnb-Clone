# Airbnb Listing Clone

An original desktop React recreation of a vacation-rental property listing, based on the publicly visible interaction model and visual language of the supplied reference. The implementation includes a listing page, photo tour, keyboard-accessible lightbox, sticky reservation card, and centralized property data.

## Tech Stack

- React 19 + TypeScript
- Vite
- Lucide React icons
- CSS design tokens and responsive constraints

## Setup

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run lint
npm run build
```

## Architecture

The page is composed from a typed property data object, a listing shell, reusable highlight and reservation sections, and two overlay states: `PhotoTour` and `Lightbox`. Overlay state lives in `App`, which also owns focus restoration, Escape handling, and wraparound navigation. The production-scale marketplace concept is documented in [docs/architecture.png](docs/architecture.png).

## AI Workflow

The work followed a screenshot-driven loop: inspect the reference, establish layout and interaction hypotheses, implement a narrow slice, run a build, launch the local app, capture a desktop screenshot, exercise keyboard interactions, and then polish the focused slice. Prompts and agent responsibilities are recorded in [docs/ai-prompts.md](docs/ai-prompts.md) and `.ai/`.

## Known Limitations

The supplied Vercel reference was protected by a security checkpoint in the inspection browser, so exact pixel measurements and original imagery were unavailable. The clone uses equivalent publicly hosted Unsplash imagery and an independently authored implementation. Date selection, checkout, account navigation, and search are intentionally visual interaction affordances rather than connected product flows.
