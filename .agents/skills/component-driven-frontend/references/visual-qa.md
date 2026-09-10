# Engineering and Visual QA

Verify behavior and rendered output separately. A passing build cannot prove visual quality.

## Discover project checks

Read available scripts without running them:

```bash
node -e "const p=require('./package.json'); console.log(JSON.stringify(p.scripts ?? {}, null, 2))"
```

Choose the project's own lint, typecheck, test, and build commands. Use its detected package manager and do not invent a script. Record every command, exit code, skipped check, and relevant warning. Inspect new dependencies, generated files, imports, client boundaries, and theme/token changes against the Component Plan.

## Exercise states and access

For every interactive or async region, verify the applicable matrix:

- default, hover, active/pressed, focus-visible, disabled, pending;
- loading, empty, error, partial/stale, success;
- validation, confirmation, cancellation, destructive failure;
- keyboard order/operation, focus entry/return, labels, landmarks, headings, live feedback;
- contrast, zoom/reflow, touch targets, screen-reader alternative for visual data, and reduced motion.

Use actual interactions where tooling permits. Do not infer runtime behavior solely from component names or code inspection.

## Capture rendered evidence

Render the same representative data and state at minimum in:

| View | Baseline | Also capture when relevant |
|---|---|---|
| Desktop | 1440 × 900 | widest dense/data state, open overlay |
| Mobile | 390 × 844 | menu/filter transformation, keyboard/form state |

Add intermediate/tablet, dark theme, localization, high zoom, or reduced motion when the product supports them or the change touches them. Wait for fonts and stable data; capture the full page plus close-ups where overflow or interaction matters. Keep screenshots tied to viewport and state names.

Inspect each image for hierarchy, alignment, spacing rhythm, shape tiers, unnecessary boxed regions, wrapping, clipping, scroll traps, overlay bounds, sticky collisions, contrast, focus visibility, content realism, and consistency with existing pages. For translucent surfaces, also inspect the backdrop at light and dark points, nested blur, edge treatment, text contrast, and the opaque fallback. Compare against supplied Figma/screenshots first, then Design Intent and Component Plan. Code inspection is not a screenshot.

Exercise motion rather than judging only still images. Verify hover, press, focus-visible, viewport reveal, and state continuity where the region declares them. A static screenshot can prove layout, but it cannot prove pointer response, progress transitions, result expansion, touch parity, or reduced-motion behavior; record an interaction assertion, trace, or state-specific capture for those behaviors.

## Iterate by discrepancy

1. Name the visible discrepancy and the governing evidence.
2. Identify the smallest token, layout, component, content, or state change that addresses it.
3. Change one cause; rerun the affected engineering check.
4. Recapture both desktop and mobile when shared layout/tokens changed.
5. Repeat until no material discrepancy remains or a documented blocker requires user input.

Do not “polish” by adding gradients, glass, glow, Bento, beams, shadows, rounded cards, or motion unless the Design Intent calls for that exact treatment. When it does, verify the full shape/material/interaction system from [visual language](visual-language.md), not merely the presence of the effect.

## Report truthfully

Separate the final report into:

- **Engineering verified:** commands and results.
- **Rendered verified:** viewports, states, and comparisons actually inspected.
- **Not verified:** missing browser/device/source, blocked state, and consequence.
- **Residual concerns:** concrete risk and next evidence needed.

If desktop or mobile rendering was not inspected, state **“Visual QA incomplete”**. If a required source, interaction state, accessibility check, or project command was unavailable, name it. Never replace missing visual evidence with “looks correct,” a passing build, or a code-only claim.
