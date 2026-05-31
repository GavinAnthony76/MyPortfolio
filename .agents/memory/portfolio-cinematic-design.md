---
name: Portfolio cinematic design
description: Durable facts about the dark cinematic editorial frontend for gavineanthony.com — why it was rolled back before, and how project images are wired.
---

# Dark cinematic editorial design

The portfolio frontend is a dark cinematic editorial multi-page design (Home/Works/WorkDetail/About/Contact),
black background, white minimal type, Inter + Cormorant Garamond fonts.

## WebGL rollback
**Rule:** Never re-add a WebGL / three.js "lens" effect (or any WebGL) to this site.
**Why:** An earlier full overhaul of this exact design was rolled back by the user because a WebGL lens
carousel on the homepage caused problems. The core design itself (without WebGL) is solid and was restored.
**How to apply:** When restoring/extending the cinematic design, keep it CSS/JS-only; no canvas/WebGL deps.

## Project images
**Rule:** Featured project images are real screenshots of the live client sites (e.g. txshowdown.com,
jamaicanyammingz.com), stored in `attached_assets/screenshots/` and imported in `projects-data.ts` via the
`@assets` Vite alias.
**Why:** `attached_assets/` is NOT served by the web server, so direct URL/src paths fail; only the @assets
import (or copying into public/) works. Older entries used `/api/assets/:filename` served by an assetMap in
server/routes.ts — both patterns coexist.

## Backend boundary
The overhaul is frontend-only. Contact form posts to `POST /api/project-requests`; ticket lookup hits
`GET /api/project-status/:ticketNumber`. Dashboard/auth/ticket/testimonial backend is untouched.
