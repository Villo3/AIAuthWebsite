# Ready-to-paste OMP prompt

## Objective

Implement a premium, scroll-driven opening splash for the Boundary marketing site. The first viewport should feel like a security boundary: two black, organic wave-edged halves meet at a luminous Boundary-blue seam and open from the center as the visitor scrolls, revealing the existing product site below.

The opening message is:

- `Protect your boundary.`
- Supporting line: `Autonomous software moves fast. Control stays ahead.`
- Scroll cue: `SCROLL TO OPEN`

The result should feel deliberate and product-specific, not like a generic AI landing-page template.

## Context and constraints

- Start from a fresh branch or worktree based on current `origin/main`.
- Read `README.md`, `package.json`, `app/page.tsx`, `app/globals.css`, and the existing UI primitives before scanning broadly.
- Preserve the current Boundary design system: warm paper, near-black surfaces, electric blue, precise mono metadata, square geometry, and the existing black-and-white brand mark.
- Preserve all existing sections, anchors, access-request behavior, privacy/terms routes, metadata, and Vercel compatibility.
- Do not redesign the rest of the page, add unrelated sections, change product claims, or add a heavy animation dependency.
- Reuse the repository's existing Framer Motion dependency and React patterns.
- Use 21st.dev's polished reveal/preloader work only as interaction inspiration; do not blindly install or copy a component whose visual language conflicts with Boundary.

## Initial investigation

Inspect the current top-level page composition, responsive breakpoints, reduced-motion handling, and dependencies. Confirm how the hero and header are rendered before editing. Identify any existing motion utilities or tests that should be reused.

For this medium-sized UI task, use no more than three focused OMP subagents if useful:

1. A read-only explorer for the page structure, styling, and likely regression points.
2. A motion/accessibility reviewer for scroll behavior, mobile behavior, keyboard flow, and `prefers-reduced-motion`.
3. A final visual/diff reviewer after implementation.

Give each worker the exact files above and a narrow objective. Avoid overlapping edits; the main agent should own integration.

## Implementation requirements

- Add a full-viewport opening section before the existing header and hero.
- Make the splash scroll-led, not a timed loading screen. The visitor must scroll through it.
- Keep the stage sticky for roughly one additional viewport of scroll travel.
- Build two near-black curtain/wall halves with organic vertical wave edges that split from the center in direct response to scroll progress.
- Use a restrained blue seam/glow at the center to make Boundary blue the focal point.
- Fade and slightly lift the opening copy as the split begins.
- Reveal the existing warm-paper visual language behind the walls and continue directly into the unchanged header and hero; do not add an intermediate status screen or control-plane message.
- Keep the animation bidirectional: scrolling upward should close it cleanly.
- Do not lock the wheel, hijack scrolling, autoplay a long intro, or require a click to enter.
- Avoid canvas, WebGL, video, and unnecessary image assets. Prefer composited SVG/CSS geometry and transforms.
- Prevent horizontal overflow, layout shifts, duplicate IDs, and inaccessible duplicate page content.
- Maintain usable behavior on narrow mobile viewports and Safari.
- Under `prefers-reduced-motion: reduce`, disable the moving split and provide a calm, static opening that can be scrolled past normally.
- Decorative geometry must be hidden from assistive technology; the message must remain semantic and readable.
- Keep body text readable and preserve current focus behavior.

## Verification

Run the repository's exact available commands, including at minimum:

```bash
npm run lint
npm run check
npm run build
```

Then verify in a real browser at desktop and mobile sizes:

- Initial splash matches Boundary's visual language.
- Scroll opens the two wave edges smoothly and reverses correctly.
- The existing header and hero appear immediately after the splash.
- No horizontal scrolling or clipped text occurs.
- Existing navigation anchors and request-access form still work.
- Reduced-motion behavior is static and usable.
- There are no console errors or hydration warnings.

Fix any failures introduced by the change. Inspect the final diff for accidental copy changes, unrelated formatting, dead code, unnecessary dependencies, and regressions.

## Definition of done

- The opening interaction is implemented, responsive, accessible, and visually coherent with Boundary.
- Existing product content and functionality remain intact.
- All required checks pass.
- Browser verification covers desktop, mobile, reverse scrolling, and reduced motion.
- The final report lists changed files, commands run, results, screenshots or visual evidence, and any unverified criterion.
- Do not claim completion if the build fails, runtime errors remain, or the animation has not been tested in a real browser.
