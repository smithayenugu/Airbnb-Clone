# AI Prompt Record

This is the prompt record for the development session. The entries below preserve the prompts used to guide the work, grouped by the phase they supported. They are intentionally concise summaries of the working prompts rather than a reconstructed transcript.

## 1. Reference Inspection

> Inspect the supplied reference through the browser before coding. Capture its visible page structure, title, header, search UI, gallery, listing details, reservation card, photo tour, lightbox, keyboard behavior, and desktop layout assumptions. Do not copy source code, bundled JavaScript, HTML, CSS, or private implementation details.

> If the reference is blocked by a security checkpoint, record that limitation, use only publicly exposed metadata and the assignment requirements, and create an original implementation plan from observable Airbnb-style behavior.

## 2. Implementation Plan

> Create a phased plan for an original desktop vacation-rental listing: scaffold the project, build the listing page, implement the gallery and photo tour, add the lightbox and keyboard navigation, perform screenshot QA, audit accessibility, create the architecture diagram and AI documentation, then run final checks.

## 3. Project Setup

> Create a lightweight React + Vite + TypeScript project with a production build, a type-check script, centralized property data, CSS design tokens, and Lucide icons. Keep the structure maintainable without introducing unnecessary state-management libraries.

## 4. Data Architecture

> Build a typed property data object containing the title, location, rating, review count, host, guest and room metadata, price, amenities, description, and a centralized list of image assets. Make the UI consume this data rather than duplicating listing content in JSX.

## 5. Page Architecture

> Build an original desktop listing shell with an Airbnb-style header, brand navigation, search pill, property title and metadata, share/save controls, five-image hero gallery, listing details, host information, highlights, sleeping arrangement, amenities, description, and sticky reservation card.

## 6. Component Generation

> Keep the React implementation componentized around the listing shell, header, highlight rows, reservation card, photo tour, and lightbox. Prefer semantic HTML buttons and figures, meaningful image alt text, and local state in the smallest owning component.

## 7. Gallery and Photo Tour

> Make every hero/gallery image and the “Show all photos” control open a full-screen photo tour. Display all property photos in a scrollable grid with a close control, visible photo count, hover feedback, and clickable images that open the selected image in the lightbox.

## 8. Lightbox

> Implement a single-photo lightbox with a centered image, counter, previous and next controls, close control, dark backdrop, wraparound navigation, and restrained transitions. Support Escape, ArrowLeft, ArrowRight, Enter, Space, Tab, and backdrop dismissal through native controls and dialog semantics.

## 9. Listing Interactions

> Add real visible state for Save, Share, and the header search control. Save should toggle to Saved, Share should provide Link copied feedback, and the search control should expose its expanded state. Gallery controls must remain keyboard and pointer accessible.

## 10. Visual Matching

> Run the local app at a deterministic desktop viewport, capture the page, and compare header alignment, constrained content width, title spacing, gallery proportions, image cropping, typography, reservation card position, borders, radii, and shadows. Make only targeted CSS adjustments and preserve the existing component structure.

> Use equivalent legitimate public imagery when exact reference assets cannot be reliably reused. Prioritize the measured layout, cropping, spacing, and interaction behavior over copying any reference implementation.

## 11. Debugging and Validation

> Run the production build and repair only the local compiler or type error revealed by the focused check. Rerun the same command immediately after the repair before continuing to adjacent work.

> After the app is running, verify that the page loads, all expected images have alt text, the main heading and reservation card render, and the local development server responds at the expected URL.

## 12. Accessibility

> Audit the listing and overlays for semantic buttons, meaningful labels, visible focus states, dialog semantics, image alt text, focus entry on close controls, focus restoration after closing, Escape handling, arrow-key navigation, logical Tab order, and backdrop dismissal without creating a keyboard trap.

## 13. AI Agent and Skill Configuration

> Create focused guidance for a frontend agent, visual QA agent, and accessibility agent. Add skills for screenshot-based visual testing and component review. Keep each responsibility narrow and document concrete checks rather than creating unnecessary agents.

## 14. Documentation

> Write a README covering the project overview, tech stack, setup, development command, build command, architecture explanation, AI tools and workflow, and known limitations. Record the prompts used during setup, architecture, component generation, visual matching, debugging, accessibility, and final polish.

## 15. Architecture Diagram

> Create a production-scale conceptual architecture diagram for a vacation-rental marketplace. Show User, CDN/Edge, Frontend, API Gateway, Load Balancer, container/serverless deployment, monitoring/logging, backend services for authentication, properties, bookings, users, payments, search, reviews, and notifications, plus PostgreSQL, Redis, object storage, search index, and message queue.

## 16. Final Polish

> Review the implementation for unused imports, broken links, console errors, missing alt text, unnecessary dependencies, unstable layout dimensions, and incomplete interaction states. Keep unrelated changes out of scope and preserve the original implementation constraint.

> Run the final type check and production build. Re-run the browser interaction checks for Save, Share, search expansion, photo tour opening, lightbox navigation, Escape close, and focus restoration. Report any remaining limitations honestly.
