# Design Intent

Define intent before selecting components. Make each decision traceable to evidence, not to a fashionable demo.

## Resolve evidence

Use this hierarchy, highest first:

1. Follow explicit user requirements and acceptance criteria.
2. Follow brand rules, accessibility policy, content strategy, and supplied assets.
3. Follow Figma, Code Connect, annotated screenshots, and approved reference designs.
4. Preserve the project's tokens, type scale, theme, layout conventions, and current foundation.
5. Use verified official component documentation and platform conventions.
6. Introduce a local design decision only where higher evidence is silent; label it as an assumption.

When evidence conflicts, stop and name the conflict, affected decision, and smallest choice the user must make. Never use this guide to override supplied design truth.

## Write six fields

Produce all six fields in a compact Design Intent:

| Field | Decide |
|---|---|
| `product` | Product/page type and business context |
| `audience` | Primary users, environment, and relevant ability constraints |
| `coreTask` | The single action or understanding the page must optimize |
| `visualDirection` | 2–4 grounded qualities plus explicit shape, material, interaction, and effect boundaries |
| `density` | `compact`, `comfortable`, or `spacious`, with a task-based reason |
| `principles` | 3–5 testable rules covering hierarchy, responsiveness, and access |

Examples set boundaries, not templates: “calm operational workspace; dense tables but generous section spacing; no decorative glow” or “editorial commerce; product imagery leads; restrained motion; no glass surfaces.” Do not copy their palettes or layouts.

## Set visual rules

- **Typography:** Keep the existing family unless brand evidence authorizes change. Define display/body/label roles, readable measures, and a limited weight range. Use size and spacing before decorative effects to establish hierarchy.
- **Color:** Start from existing semantic tokens. Assign colors by purpose—surface, text, border, action, status—and verify contrast. Add a new accent only when it has a defined role.
- **Spacing, shape, and material:** Use the project's spacing and radius scales. Let content relationships determine gaps. Define surface depth and fallback behavior before using translucency or blur. Do not wrap every region in a large rounded container. Read [visual language](visual-language.md) when shape or material affects the direction.
- **Interaction and motion:** State purpose, trigger, duration character, and reduced-motion behavior. Prefer state continuity and input feedback. A core product demonstration needs more than a whole-section fade. Read [visual language](visual-language.md) for the interaction inventory.
- **Responsive/accessibility:** Identify reading order, collapse behavior, touch targets, focus visibility, semantics, zoom/reflow, and reduced motion before implementation.

## Reject generic AI UI

Reject or revise the direction when any answer is “yes” without evidence:

- Does “premium” merely mean dark mode, purple/blue gradients, glass, glow, beams, or floating orbs?
- Is Bento used because it is trendy rather than because independent content units need a grid?
- Are oversized headings, pills, rounded cards, or shadows repeated without hierarchy?
- Are multiple font styles, accent colors, and animations competing for attention?
- Could the same visual direction be pasted onto an unrelated SaaS, portfolio, or storefront unchanged?
- Does decoration reduce contrast, scannability, performance, or reduced-motion support?

Revise toward product-specific hierarchy, content, and interaction. A gradient, glass surface, Bento composition, beam, or animation is acceptable only when a higher-ranked source or an explicit functional rationale supports it.
