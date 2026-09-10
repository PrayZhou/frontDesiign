# Axiom AI Agent Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium, responsive React marketing homepage for Axiom that lets visitors run a deterministic Research → Analyze → Execute product preview.

**Architecture:** A Vite React application composes focused marketing sections around one page-owned demo state machine. shadcn/ui is the single component foundation, Tailwind supplies tokens and responsive layout, and product-specific execution visuals remain local semantic React/CSS compositions.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui with Radix primitives, Lucide, Vitest, Testing Library

**Spec:** `docs/superpowers/specs/2026-09-10-ai-agent-website-design.md`

**Component plan:** `docs/superpowers/plans/2026-09-10-ai-agent-website-components.json`

## Global Constraints

- The implementation is front-end only and must not imply a live AI backend, real customers, or confirmed integration partnerships.
- Use exactly one component foundation: shadcn/ui. Use no visual enhancer library.
- Use graphite surfaces, warm-white text, and one electric-cyan action/state accent; do not add generic purple gradients, glass-card collages, or decorative Bento grids.
- Keep Research, Analyze, and Execute as one connected workflow.
- The primary CTA must focus the task composer or start the deterministic demo.
- Support keyboard navigation, visible focus, WCAG AA contrast, 320 CSS px reflow, 200% zoom, and `prefers-reduced-motion`.
- Do not claim completion until type checking, linting, tests, production build, and desktop/mobile rendered review pass.

## File Structure

- `package.json`, `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`: application and verification toolchain.
- `components.json`, `src/components/ui/*`, `src/lib/utils.ts`: shadcn/ui foundation and its utility.
- `src/main.tsx`, `src/App.tsx`: application entry and page assembly only.
- `src/index.css`: design tokens, global typography, focus treatment, responsive styling, and product-specific visual classes.
- `src/features/agent-demo/model.ts`: demo types, sample tasks, reducer, and transition rules.
- `src/features/agent-demo/use-agent-demo.ts`: timer lifecycle and page-level demo controller.
- `src/features/agent-demo/model.test.ts`, `src/features/agent-demo/use-agent-demo.test.tsx`: state and timer behavior.
- `src/components/marketing/site-header.tsx`: desktop navigation and mobile Sheet.
- `src/components/marketing/hero.tsx`: hero copy, CTA, composer, and run preview composition.
- `src/components/marketing/task-composer.tsx`: labeled objective input and sample-task controls.
- `src/components/marketing/agent-run-preview.tsx`: accessible execution states and result summary.
- `src/components/marketing/capability-sequence.tsx`: connected three-stage explanation.
- `src/components/marketing/workspace-demo.tsx`: objective, plan, evidence, and artifacts.
- `src/components/marketing/supporting-sections.tsx`: evidence rail, use cases, integration categories, final CTA, and footer.
- `src/components/marketing/marketing-page.test.tsx`: navigation, CTA, semantics, and page-level behavior.
- `src/test/setup.ts`: DOM test matchers and cleanup.

---

### Task 1: Scaffold the verified component foundation and test harness

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `eslint.config.js`
- Create: `index.html`
- Create: `components.json`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`
- Create: `src/test/setup.ts`
- Create: `src/app.test.tsx`
- Create: `src/lib/utils.ts`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/textarea.tsx`
- Create: `src/components/ui/badge.tsx`
- Create: `src/components/ui/separator.tsx`
- Create: `src/components/ui/sheet.tsx`

**Interfaces:**
- Consumes: Current official shadcn/ui Vite setup and registry components `button`, `textarea`, `badge`, `separator`, and `sheet`.
- Produces: `@/*` import alias, shared UI primitives, Tailwind tokens, and `npm run test|lint|build` commands.

- [ ] **Step 1: Create the Vite React TypeScript project**

Run the official scaffold non-interactively in a temporary directory, then copy only generated app files into the repository so `docs/` and Git history remain intact:

```bash
npm create vite@latest /tmp/axiom-site -- --template react-ts
cp -R /tmp/axiom-site/. .
npm install
```

- [ ] **Step 2: Configure Tailwind and initialize the one foundation**

Run:

```bash
npm install tailwindcss @tailwindcss/vite lucide-react
npx shadcn@latest init -t vite -b radix --yes
npx shadcn@latest add button textarea badge separator sheet --yes
```

Configure `vite.config.ts` with `react()`, `tailwindcss()`, and alias `@` → `./src`. Keep the generated shadcn primitive files as the only foundation.

- [ ] **Step 3: Add the failing smoke test**

Install the test runtime:

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Add scripts `"test": "vitest run"`, `"test:watch": "vitest"`, and `"typecheck": "tsc -b"`. Configure Vitest in `vite.config.ts` with `environment: "jsdom"` and `setupFiles: ["./src/test/setup.ts"]`.

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest"
```

Create `src/app.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react"
import App from "./App"

it("renders the Axiom product heading", () => {
  render(<App />)
  expect(screen.getByRole("heading", { name: /from objective to outcome/i })).toBeInTheDocument()
})
```

- [ ] **Step 4: Run the smoke test and verify the intended failure**

Run: `npm test -- src/app.test.tsx`

Expected: FAIL because the scaffolded App does not contain the Axiom heading.

- [ ] **Step 5: Add the minimal semantic application shell**

Replace `src/App.tsx` with:

```tsx
export default function App() {
  return (
    <main>
      <h1>From objective to outcome.</h1>
    </main>
  )
}
```

Replace the scaffold CSS with `@import "tailwindcss";`, semantic color variables for graphite surfaces/electric cyan, a warm-white foreground, selection styling, and a global `:focus-visible` ring. Do not add decorative gradients.

- [ ] **Step 6: Verify and commit the foundation**

Run: `npm test -- src/app.test.tsx && npm run typecheck && npm run lint && npm run build`

Expected: all commands PASS.

```bash
git add package.json package-lock.json vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json eslint.config.js index.html components.json src
git commit -m "chore: scaffold Axiom design system"
```

### Task 2: Build the deterministic agent demo state machine

**Files:**
- Create: `src/features/agent-demo/model.ts`
- Create: `src/features/agent-demo/model.test.ts`
- Create: `src/features/agent-demo/use-agent-demo.ts`
- Create: `src/features/agent-demo/use-agent-demo.test.tsx`

**Interfaces:**
- Consumes: React hooks and Vitest fake timers.
- Produces: `AgentStage`, `AgentDemoState`, `DemoTask`, `demoTasks`, `agentDemoReducer(state, action)`, and `useAgentDemo()` returning `{ state, selectTask, setObjective, run, restart }`.

- [ ] **Step 1: Write reducer tests first**

Create `src/features/agent-demo/model.test.ts`:

```ts
import { agentDemoReducer, demoTasks, initialAgentDemoState } from "./model"

it("selects a task and returns to ready", () => {
  const state = agentDemoReducer(initialAgentDemoState, { type: "select", task: demoTasks[1] })
  expect(state.objective).toBe(demoTasks[1].objective)
  expect(state.stage).toBe("ready")
})

it("advances through research, analysis, execution, and completion", () => {
  let state = agentDemoReducer(initialAgentDemoState, { type: "run" })
  for (const stage of ["researching", "analyzing", "executing", "complete"] as const) {
    state = agentDemoReducer(state, { type: "advance" })
    expect(state.stage).toBe(stage)
  }
})

it("keeps an empty objective idle", () => {
  const empty = { ...initialAgentDemoState, objective: "" }
  expect(agentDemoReducer(empty, { type: "run" }).stage).toBe("idle")
})
```

- [ ] **Step 2: Run the reducer tests to verify failure**

Run: `npm test -- src/features/agent-demo/model.test.ts`

Expected: FAIL because `model.ts` does not exist.

- [ ] **Step 3: Implement typed tasks and reducer**

Define:

```ts
export type AgentStage = "idle" | "ready" | "planning" | "researching" | "analyzing" | "executing" | "complete" | "error"

export type DemoTask = {
  id: string
  label: string
  objective: string
  sources: number
  result: string
}

export type AgentDemoState = {
  selectedTaskId: string
  objective: string
  stage: AgentStage
}
```

Create three honest sample tasks for market intelligence, product planning, and operations. `run` maps a non-empty objective to `planning`; `advance` follows `planning → researching → analyzing → executing → complete`; `select`, `edit`, and `restart` clear any in-progress state without duplicating task data.

- [ ] **Step 4: Add hook lifecycle tests**

Create `use-agent-demo.test.tsx` using `renderHook`, `act`, and `vi.useFakeTimers()`. Assert that `run()` enters `planning`, four timer advances reach `complete`, `selectTask()` cancels the previous sequence, and unmount clears pending timers.

- [ ] **Step 5: Run hook tests to verify failure**

Run: `npm test -- src/features/agent-demo/use-agent-demo.test.tsx`

Expected: FAIL because `use-agent-demo.ts` does not exist.

- [ ] **Step 6: Implement the timer-owning controller**

Use one reducer and one effect keyed by `state.stage`. Schedule the next stage only for `planning`, `researching`, `analyzing`, and `executing`; return `clearTimeout(timer)` from the effect. Use 550 ms per stage normally and 0 ms when `matchMedia("(prefers-reduced-motion: reduce)").matches`.

- [ ] **Step 7: Verify and commit the model**

Run: `npm test -- src/features/agent-demo && npm run typecheck`

Expected: all tests PASS.

```bash
git add src/features/agent-demo
git commit -m "feat: add deterministic agent demo model"
```

### Task 3: Implement the header, hero, composer, and live run preview

**Files:**
- Create: `src/components/marketing/site-header.tsx`
- Create: `src/components/marketing/task-composer.tsx`
- Create: `src/components/marketing/agent-run-preview.tsx`
- Create: `src/components/marketing/hero.tsx`
- Create: `src/components/marketing/hero.test.tsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: shadcn `Button`, `Textarea`, `Badge`, `Sheet`; `DemoTask`, `AgentDemoState`, and actions from `useAgentDemo()`.
- Produces: `SiteHeader`, `TaskComposer`, `AgentRunPreview`, and `Hero` with a forwarded composer textarea ref.

- [ ] **Step 1: Write the interaction tests**

Create `src/components/marketing/hero.test.tsx` that renders `Hero` with a controller harness and asserts:

```tsx
expect(screen.getByLabelText(/objective/i)).toHaveValue(demoTasks[0].objective)
await user.click(screen.getByRole("button", { name: demoTasks[1].label }))
expect(screen.getByLabelText(/objective/i)).toHaveValue(demoTasks[1].objective)
await user.click(screen.getByRole("button", { name: /run axiom/i }))
expect(screen.getByRole("status")).toHaveTextContent(/planning/i)
```

Also assert that clearing the textarea disables Run Axiom and that the Start with a task header button focuses the objective textarea.

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- src/components/marketing/hero.test.tsx`

Expected: FAIL because the marketing components do not exist.

- [ ] **Step 3: Implement `SiteHeader` and `TaskComposer`**

Use a `header` and `nav` with real `#product`, `#workflow`, and `#integrations` anchors. Use shadcn `Sheet` for mobile navigation with a visible title and `Button` for the menu trigger. `TaskComposer` renders a persistent `label`, controlled `Textarea`, three native sample buttons, disabled/run states, and helper text identifying the preview as deterministic.

- [ ] **Step 4: Implement `AgentRunPreview`**

Render a semantic ordered list for Plan, Research, Analyze, Execute. Map the stage to completed/current/pending text and icons, not color alone. Add `role="status" aria-live="polite"` around a single short status sentence. On completion, show the selected task's source count and result; on error, show textual recovery and a restart button.

- [ ] **Step 5: Compose the hero**

Use an asymmetric two-column section with the eyebrow `AUTONOMOUS WORK ENGINE`, `h1` text `From objective to outcome.`, concise audience-specific copy, the primary focus-moving CTA, and the connected composer/preview product surface. Add one subtle CSS signal line that switches off under reduced motion.

- [ ] **Step 6: Verify and commit the first viewport**

Run: `npm test -- src/components/marketing/hero.test.tsx && npm run typecheck && npm run lint`

Expected: all commands PASS.

```bash
git add src/components/marketing src/index.css
git commit -m "feat: build Axiom interactive hero"
```

### Task 4: Build the connected workflow and product workspace

**Files:**
- Create: `src/components/marketing/capability-sequence.tsx`
- Create: `src/components/marketing/workspace-demo.tsx`
- Create: `src/components/marketing/workspace-demo.test.tsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: `AgentDemoState`, selected `DemoTask`, Lucide icons, and shared Badge/Separator primitives.
- Produces: `CapabilitySequence` and `WorkspaceDemo({ state, task }: { state: AgentDemoState; task: DemoTask })`.

- [ ] **Step 1: Write workspace state tests**

Create `workspace-demo.test.tsx` and render explicit state fixtures. Assert that idle shows `Choose an objective`, planning shows a skeleton with `Preparing the execution plan`, error shows `Run interrupted` and recovery text, and complete shows the task result plus an ordered plan and `Sources reviewed`.

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- src/components/marketing/workspace-demo.test.tsx`

Expected: FAIL because `WorkspaceDemo` does not exist.

- [ ] **Step 3: Implement the capability sequence**

Render `section#workflow` with one heading and an ordered list of three stages. Each list item contains a two-digit index, one verb, one outcome sentence, and an output label. CSS connectors visually link the items at large widths and become a vertical rule on mobile.

- [ ] **Step 4: Implement the workspace states**

Render `section#product` and a single large workspace boundary. Within it, use named regions for Objective, Plan, Evidence, and Deliverables. Keep task data in `model.ts`; never create fake customer metrics. Use text plus icons for status, and preserve Objective → Plan → Evidence → Deliverables DOM order at every breakpoint.

- [ ] **Step 5: Verify and commit the product story**

Run: `npm test -- src/components/marketing/workspace-demo.test.tsx && npm run typecheck && npm run lint`

Expected: all commands PASS.

```bash
git add src/components/marketing src/index.css
git commit -m "feat: add connected agent workflow"
```

### Task 5: Complete supporting proof, conversion, and page assembly

**Files:**
- Create: `src/components/marketing/supporting-sections.tsx`
- Create: `src/components/marketing/marketing-page.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: all earlier marketing components and `useAgentDemo()`.
- Produces: the complete Axiom homepage and one composer ref shared by header, hero, and final CTA.

- [ ] **Step 1: Write page-level tests**

Create `marketing-page.test.tsx`. Assert one banner, one main, and one contentinfo landmark; sections named Product, Workflow, Use cases, and Integrations; no customer-logo or performance-stat claims; three Start with a task actions all focus the same objective field; and mobile menu open/close works with its accessible trigger.

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- src/components/marketing/marketing-page.test.tsx`

Expected: FAIL because the complete page is not assembled.

- [ ] **Step 3: Implement supporting sections**

Create an evidence rail with `Cited research`, `Reviewable plans`, and `Tool-aware execution`; use-case copy for Market intelligence, Product planning, and Operations; and an integration-category strip for Browser, Documents, Data, and Team tools. Use category labels, not third-party brand logos. Add a final conversion section and a minimal footer.

- [ ] **Step 4: Assemble `App`**

Own `useAgentDemo()` and `composerRef` at the page level. Pass state and actions downward. Implement one `focusComposer()` function that scrolls the textarea into view, then focuses it. Render the semantic sequence `SiteHeader → main(Hero, evidence, CapabilitySequence, WorkspaceDemo, use cases, integrations, FinalCTA) → SiteFooter`.

- [ ] **Step 5: Finish responsive and accessibility CSS**

Use fluid type with `clamp()`, 44 px minimum interactive heights on touch layouts, and breakpoints that convert two-column regions to one semantic column. Add 320 px overflow protection and a `@media (prefers-reduced-motion: reduce)` block that removes transition duration, animated signal traversal, and smooth scrolling.

- [ ] **Step 6: Verify and commit the complete page**

Run: `npm test && npm run typecheck && npm run lint && npm run build`

Expected: all commands PASS with zero TypeScript or ESLint errors.

```bash
git add src
git commit -m "feat: complete Axiom marketing page"
```

### Task 6: Render, inspect, and refine desktop and mobile output

**Files:**
- Modify: `src/index.css`
- Modify: any `src/components/marketing/*.tsx` file only when inspection reveals a concrete issue

**Interfaces:**
- Consumes: production-ready page from Task 5.
- Produces: visually verified desktop and mobile layouts meeting the Design Intent and Component Plan.

- [ ] **Step 1: Start the production preview**

Run: `npm run build && npm run preview -- --host 127.0.0.1`

Expected: Vite reports a local preview URL and serves the production bundle.

- [ ] **Step 2: Capture required viewports**

Use browser rendering to capture full-page screenshots at 1440 × 1000 and 390 × 844. Also inspect 320 px width and 200% browser zoom for horizontal page overflow.

- [ ] **Step 3: Review against explicit checks**

Confirm that the first viewport contains the promise, objective input, and primary CTA; cyan is reserved for active/action state; no text is clipped; hero/workspace reading order survives stacking; the mobile sheet remains within the viewport; all visible controls have hover/focus/disabled states; and reduced-motion mode removes ambient traversal without hiding status.

- [ ] **Step 4: Fix only observed issues and re-render**

For every issue, record the viewport and symptom in the implementation notes, change the smallest responsible component or style, rerun its tests, and recapture the affected viewport. Repeat until the checklist passes.

- [ ] **Step 5: Run final verification and commit**

Run:

```bash
npm test
npm run typecheck
npm run lint
npm run build
git diff --check
```

Expected: every command exits 0, and desktop/mobile rendered review has no unresolved findings.

```bash
git add src package.json package-lock.json
git commit -m "fix: polish responsive Axiom experience"
```
