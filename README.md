# FrontDesign

This repository contains two connected deliverables:

- **Axiom** — a polished React marketing site for an AI agent platform, built as a practical demonstration of the design workflow.
- **`component-driven-frontend`** — a repository-scoped Codex Skill that turns product intent into a source-verified Component Plan, implementation guidance, and rendered visual QA.

## Run the Axiom demo

The app uses React 19, TypeScript, Vite, Tailwind CSS, shadcn-compatible primitives, Motion, and Lucide icons.

```bash
npm install
npm run dev
```

Production and verification commands:

```bash
npm test
npm run lint
npm run build
npm run preview
node scripts/visual-qa.mjs
node scripts/glass-style-qa.mjs
```

The browser QA scripts expect the preview server at `http://127.0.0.1:4173/`. They verify responsive layout, core interactions, reduced-motion behavior, and the page's radius/glass material contract.

## Use the frontend Skill

Keep the Skill at `.agents/skills/component-driven-frontend` for project-scoped use. It is intended for React interface work that requires design-system, component-selection, visual-language, responsive, interaction, or accessibility judgment.

For personal use, copy it into `${CODEX_HOME:-$HOME/.codex}/skills` without overwriting an existing destination:

```bash
personal_skills_dir="${CODEX_HOME:-$HOME/.codex}/skills"
destination="$personal_skills_dir/component-driven-frontend"
mkdir -p "$personal_skills_dir"
if [ -e "$destination" ]; then
  printf 'Existing destination: %s\nRefusing to replace it; move or remove it first.\n' "$destination" >&2
  exit 1
fi
cp -R .agents/skills/component-driven-frontend "$destination"
```

The core workflow is:

```bash
node .agents/skills/component-driven-frontend/scripts/inspect-project.mjs --root . --json
node .agents/skills/component-driven-frontend/scripts/query-components.mjs --source project --query 'data table' --root . --json
node .agents/skills/component-driven-frontend/scripts/validate-component-plan.mjs --file component-plan.json --strict --json
```

The Skill preserves one foundation design system, permits at most one compatible visual enhancer, verifies components from current sources, and applies explicit shape, material, and interaction systems instead of treating generic cards or effects as design quality.

Read the full workflow in [`.agents/skills/component-driven-frontend/SKILL.md`](.agents/skills/component-driven-frontend/SKILL.md) and the visual rules in [`.agents/skills/component-driven-frontend/references/visual-language.md`](.agents/skills/component-driven-frontend/references/visual-language.md).

See a complete, strict-mode-valid SaaS dashboard contract at [`.agents/skills/component-driven-frontend/examples/component-plan.example.json`](.agents/skills/component-driven-frontend/examples/component-plan.example.json). It uses shadcn as the foundation and Magic UI only as a visual enhancer.

Candidate `relevanceScore` ranks literal query matches for discovery. It is not the separate 100-point final-fit assessment described in the component-selection guide.

The Skill's [visual-language guide](.agents/skills/component-driven-frontend/references/visual-language.md) turns an approved direction into explicit shape, material, and interaction systems. It prevents both boxed-page repetition and indiscriminate glass/motion while requiring real state feedback for core product demonstrations.

## Extend registry support

To add a Registry-compatible adapter, normalize its obtained item into the full stable Candidate shape documented in `references/component-selection.md`, including nullable `installCommand` and `docsUrl`, discovery-only `relevanceScore`, and warnings. Do not embed a static catalog: Registry data changes, and selection must remain tied to available source truth.

## Verify the Skill

Run the full suite, Skill validator, and all three representative acceptance CLIs from the repository root:

```bash
node --test .agents/skills/component-driven-frontend/tests/*.test.mjs
python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/scripts/quick_validate.py" .agents/skills/component-driven-frontend
node .agents/skills/component-driven-frontend/scripts/inspect-project.mjs --root . --json
node .agents/skills/component-driven-frontend/scripts/query-components.mjs --source registry-file --registry-file .agents/skills/component-driven-frontend/tests/fixtures/registry.json --query "animated hero" --json
node .agents/skills/component-driven-frontend/scripts/validate-component-plan.mjs --file .agents/skills/component-driven-frontend/examples/component-plan.example.json --strict --json
```

The Skill scripts require Node.js 18 or later and use only Node's standard library.
