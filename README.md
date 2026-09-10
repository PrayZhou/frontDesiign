# Component-Driven Frontend Skill

This repository contains the `component-driven-frontend` Codex Skill. It turns a product brief into a source-verified Component Plan so a React interface can reuse the project's existing design system instead of assembling a second one from remembered component names.

## Install

For project-scoped use, keep the Skill in this repository at `.agents/skills/component-driven-frontend`. Codex can also use a personal copy:

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

This deliberately warns and stops when the destination already exists; inspect the existing personal Skill before replacing it.

The scripts require Node.js 18 or later and use only Node's standard library.

## When to use it

Use the Skill when designing or implementing a React interface that should fit an existing design system, when choosing components from a verified project or registry source, or when converting a product brief into a component-based page plan.

Do not use it for a logic-only React bug or an isolated one-line style edit whose target and value are already explicit. A small edit takes the Skill's lightweight path only when choosing a token, variant, component, or accessibility behavior requires actual design-system judgment. Do not use it as a generic visual-style generator, to replace a project's foundation without authorization, or to invent unverified component APIs. It is a planning and evidence workflow; it does not authorize installation or destructive replacement of project components.

## Inspect, query, and validate

Start with local project evidence, then query only the sources needed for each region, and validate the completed plan before implementation:

```bash
node .agents/skills/component-driven-frontend/scripts/inspect-project.mjs --root . --json
node .agents/skills/component-driven-frontend/scripts/query-components.mjs --source project --query 'data table' --root . --json
node .agents/skills/component-driven-frontend/scripts/validate-component-plan.mjs --file component-plan.json --strict --json
```

`query-components.mjs` supports these source modes:

- `project` searches local project components without network access.
- `registry-file` normalizes a downloaded Registry-compatible JSON file supplied with `--registry-file`. Because this neutral mode has no trusted namespace, its candidates return `installCommand: null` plus a warning instead of fabricating an install target.
- `shadcn`, `magicui`, and `aceternity` return an honest `requires-command` result with a quoted search command. They do not run online discovery themselves, and an empty result is not evidence that a component exists. For Magic UI and Aceternity, configure the corresponding registry first.

See a complete, strict-mode-valid SaaS dashboard contract at [`.agents/skills/component-driven-frontend/examples/component-plan.example.json`](.agents/skills/component-driven-frontend/examples/component-plan.example.json). It uses shadcn as the foundation and Magic UI only as a visual enhancer.

Candidate `relevanceScore` ranks literal query matches for discovery. It is not the separate 100-point final-fit assessment described in the component-selection guide.

The Skill's [visual-language guide](.agents/skills/component-driven-frontend/references/visual-language.md) turns an approved direction into explicit shape, material, and interaction systems. It prevents both boxed-page repetition and indiscriminate glass/motion while requiring real state feedback for core product demonstrations.

## Extend registry support

To add a Registry-compatible adapter, normalize its obtained item into the full stable Candidate shape documented in `references/component-selection.md`, including nullable `installCommand` and `docsUrl`, discovery-only `relevanceScore`, and warnings. Do not embed a static catalog: Registry data changes, and selection must remain tied to available source truth.

## Verify

Run the full suite, Skill validator, and all three representative acceptance CLIs from the repository root:

```bash
node --test .agents/skills/component-driven-frontend/tests/*.test.mjs
python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/scripts/quick_validate.py" .agents/skills/component-driven-frontend
node .agents/skills/component-driven-frontend/scripts/inspect-project.mjs --root . --json
node .agents/skills/component-driven-frontend/scripts/query-components.mjs --source registry-file --registry-file .agents/skills/component-driven-frontend/tests/fixtures/registry.json --query "animated hero" --json
node .agents/skills/component-driven-frontend/scripts/validate-component-plan.mjs --file .agents/skills/component-driven-frontend/examples/component-plan.example.json --strict --json
```
