---
name: Dark theme brightness
description: The portfolio's dark theme uses graphite grey, not pure black — readability-driven decision
---

# Dark theme brightness

The site is a "dark cinematic editorial" theme, but the base is **graphite grey (~#292929 / hsl 0 0% 16%)**, NOT pure black.

**Why:** The owner repeatedly found pure-black (#000) backgrounds "too dark / VERY hard to read." After two incremental lifts they explicitly chose to keep it dark but make it *much* brighter (graphite), rather than switch to a light theme.

**How to apply:**
- Keep solid page/section backgrounds in the graphite range; do not regress toward #000 or near-black.
- Body/foreground text and meaningful labels should stay high-opacity (roughly /70–/95 white). Reserve ultra-low opacity (≤0.15) for purely decorative dividers/separators only.
- On lighter grey backgrounds, white text loses contrast, so be generous with text opacity.
- Image gradient overlays (from/via/to-black) and translucent overlays (bg-black/XX) are intentional and stay pure black for depth/legibility over photos.
- Form inputs need visible affordance on graphite: use a real border (~/25) plus a subtle fill, and keep placeholders dim (~/45) so they read as hints, not content.
