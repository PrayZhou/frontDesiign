# AI Agent Product Website Design

## Status

Approved direction based on the user's instruction to proceed autonomously. This document defines a polished, responsive marketing homepage for an AI agent platform. The prototype is front-end only and does not connect to a live AI service.

## Design Intent

- **Product:** A next-generation AI agent platform that can research, analyze, and execute multi-step work.
- **Audience:** High-performance individual contributors and startup teams who value speed, leverage, and operational clarity.
- **Core task:** Convince a qualified visitor to start an interactive product trial immediately.
- **Visual direction:** Precise, cinematic, and instrument-like. Near-black graphite surfaces, high-contrast neutral typography, and a tightly controlled electric-cyan signal color. Avoid generic purple gradients, excessive glass panels, floating orbs, and decorative card grids.
- **Density:** Comfortable. The product console may be information-dense, while marketing sections keep generous vertical rhythm and a readable line length.
- **Principles:** The working product is the hero; every accent communicates state; motion explains progress; content stays legible at 200% zoom; mobile preserves the same narrative in a single reading order.

## Product Story

The page presents the agent as a dependable execution system rather than a chat novelty. Its narrative is:

1. Give the system a meaningful outcome.
2. Watch it build a plan and gather evidence.
3. Review its analysis and completed artifacts.
4. Start using it without arranging a sales call.

Working placeholder brand: **Axiom**. Primary promise: **From objective to outcome.** Supporting copy will emphasize sourced research, structured analysis, tool use, and visible execution.

## Information Architecture

### 1. Navigation

A restrained sticky navigation contains the Axiom wordmark, anchor links for Product, Workflow, and Integrations, a secondary Sign in action, and the primary Start building action. On mobile it collapses into an accessible menu.

### 2. Hero and task composer

The opening view uses an asymmetric editorial grid. The left side establishes the promise and contains the primary CTA. The right side is an interactive task composer connected to an execution preview. Visitors can choose a sample objective, run it, and see a short deterministic Research → Analyze → Execute sequence. This demonstration is clearly presented as an interface preview, not a functioning AI backend.

### 3. Operational proof

A narrow evidence rail presents three concrete platform qualities: cited research, reviewable plans, and tool-aware execution. It avoids unsupported customer logos or fabricated performance statistics.

### 4. Capability sequence

Research, Analyze, and Execute are shown as one connected workflow rather than three interchangeable feature cards. Each stage pairs concise outcome-focused copy with a distinct output: sources, structured findings, and completed actions.

### 5. Workspace view

A large product surface demonstrates how a complex task moves through the platform. It includes an objective, plan steps, source indicators, an execution timeline, and final deliverables. The visual hierarchy should make status understandable without relying on color alone.

### 6. Use cases and integrations

Three practical examples serve the target audience: market intelligence, product planning, and operations. An integration strip shows tool categories without implying unsupported partnerships.

### 7. Final conversion

A focused closing section repeats the core promise and Start with a task CTA. The footer contains only essential product, company, and legal navigation.

## Component and Visual System

- **Planned foundation:** shadcn/ui, installed only after its current official registry is verified. It will provide accessible structural primitives without imposing a second visual language.
- **Visual enhancer:** None. The signature execution visualization will be built from local React and CSS so its appearance is specific to the product story.
- **Icons:** Lucide, used sparingly for recognizable actions and status support.
- **Typography:** A contemporary grotesk for display and body roles, with a monospace face limited to labels, timestamps, and system output. Local/system fallbacks must preserve the hierarchy if web fonts fail.
- **Color:** Graphite background, layered neutral surfaces, warm-white primary text, muted gray supporting text, and electric cyan for active state and focus. Success and warning colors remain semantic and independently distinguishable.
- **Shape:** Small-to-medium radii and crisp one-pixel borders. Large rounded containers are reserved for the product workspace, not every section.
- **Motion:** Short transitions communicate task progression and state changes. Ambient animation is limited to one hero signal treatment and disabled under `prefers-reduced-motion`.

## Technical Architecture

- React, TypeScript, and Vite for a lightweight single-page implementation.
- Tailwind CSS for tokens and responsive composition.
- Page sections live in focused components; shared primitives and demo data stay separate from page composition.
- The interactive preview uses local typed data and a small state machine: `idle → researching → analyzing → executing → complete`.
- No network request, authentication flow, analytics, or production AI integration is included.
- CTA behavior focuses the task composer or starts the selected deterministic demo, so the primary path is testable without a backend.

## Component Boundaries

- `SiteHeader`: desktop navigation and accessible mobile menu.
- `Hero`: marketing message, CTA cluster, and product positioning.
- `TaskComposer`: sample objective selection, input affordance, and run control.
- `AgentRunPreview`: state progression, progress semantics, sources, and result summary.
- `EvidenceRail`: product qualities grounded in visible capabilities.
- `CapabilitySequence`: connected Research → Analyze → Execute explanation.
- `WorkspaceDemo`: detailed agent plan and execution artifact view.
- `UseCases`: audience-specific scenarios.
- `IntegrationStrip`: generic tool categories and connection affordances.
- `FinalCTA` and `SiteFooter`: final conversion and essential navigation.

Each component receives typed content or state through props. Only the page-level demo controller owns run state and timing.

## Interaction and Data Flow

Selecting a sample task updates the composer and resets the preview. Running a task advances through deterministic states and reveals corresponding output. A user may restart at any time. Timers are cleared when the component unmounts or a new run starts. Reduced-motion mode presents the same state changes immediately without animated traversal.

The mobile navigation traps no focus and closes on selection or Escape. The primary CTA moves focus to the task composer with a visible focus ring.

## Responsive Behavior

- **Large screens:** Hero copy and live preview share an asymmetric two-column grid; the workspace can expose plan and output simultaneously.
- **Tablets:** The hero retains two columns where readable, while workspace panels stack by narrative priority.
- **Mobile:** All content becomes one column in semantic order. Navigation collapses, wide timelines become vertical, controls remain at least 44 px high, and decorative detail is reduced before content is hidden.

## Accessibility

- Semantic landmarks and heading order define the page structure.
- All controls support keyboard operation with visible focus indicators.
- Execution status is announced through a polite live region without repeatedly interrupting screen readers.
- Color contrast targets WCAG AA, and state always has text or icon reinforcement.
- The layout must reflow without horizontal page scrolling at 320 CSS px and remain usable at 200% zoom.
- Reduced-motion preferences remove nonessential transforms and state-transition animation.

## Error and Edge Handling

Because the prototype is local, it has no network failure state. Empty custom input keeps the run action disabled and explains the requirement. Restarting cancels the previous sequence cleanly. Missing icons or fonts do not block content. If JavaScript timing is interrupted, the current status remains understandable and the user can restart.

## Verification

- Validate the component plan before implementation using the repository Skill.
- Unit-test task selection, disabled state, run progression, restart behavior, and mobile navigation.
- Run type checking, linting, tests, and a production build.
- Render and inspect the finished page at desktop and mobile widths.
- Verify keyboard navigation, focus visibility, reduced motion, overflow, readable contrast, and the complete CTA path.

## Acceptance Criteria

1. The first viewport explains what Axiom does and exposes an immediate interactive trial.
2. The visual language feels premium and technological without relying on generic gradient/glass decoration.
3. Research, analysis, and execution form one understandable workflow.
4. The page is fully responsive and keyboard usable.
5. The demo works without a backend and never implies that placeholder evidence or integrations are real.
6. Engineering checks and desktop/mobile visual review pass before completion is claimed.
