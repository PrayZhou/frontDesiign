# Component-Driven Frontend final fix report

Date: 2026-09-09

Fix base: `061ea11ff451a80d32236e28705d6a19b61e0542`

Implementation commit: `7bf6cf2` (`fix: satisfy component skill final review`)

Report commit: `docs: record component skill final fix` (the commit containing this report; its hash is reported in the final handoff)

## Status

All seven Important findings and all seven listed Minor findings are resolved. The final implementation suite, Skill validator, and three representative CLIs pass. No subagents were dispatched. Runtime scripts still use only Node.js standard-library modules, inspect projects read-only, and return online commands as unexecuted `requires-command` actions.

## Finding-by-finding mapping

### Important 1 — Query relevance, fit, and no-result behavior

- Added an eligibility gate that requires at least one normalized name, capability, or description token match before scoring. Project/foundation bonuses no longer admit unrelated candidates.
- Replaced the public Candidate `score` field with `relevanceScore`; exact stable Candidate keys are tested for Registry and project candidates.
- Documented discovery relevance as an uncapped lexical rank distinct from the separate 100-point final-fit rubric.
- Added Registry and project no-result tests.
- Files: `scripts/lib/component-query.mjs`, `tests/query-components.test.mjs`, `references/component-selection.md`, `references/source-adapters.md`, design spec, README.

### Important 2 — Registry source truth and Candidate schema

- Neutral `registry-file` candidates now return `installCommand: null` plus candidate/result warnings about the missing trusted namespace. Known trusted `shadcn`, `magicui`, and `aceternity` normalization retains verified install-command construction.
- Every Registry and project Candidate now has the same exact fields: `id`, `name`, `source`, `description`, `capabilities`, `dependencies`, `registryDependencies`, `installCommand`, `docsUrl`, `relevanceScore`, and `warnings`.
- `docsUrl` is `null` when absent.
- Files: component query implementation/tests and Candidate documentation.

### Important 3 — Validator totality for user input

- Reworked validation to establish record/string-array guards before property or collection operations.
- Malformed `capabilities`, `states`, `selection`, `accessibility`, and `dependencies` now produce structured issues instead of exceptions.
- CLI malformed-type JSON exits `1`, writes parseable findings to stdout, and leaves stderr empty.
- Corrupted JSON remains a runtime/file error: exit `2`, stdout empty, diagnostic on stderr.
- Files: `scripts/lib/plan-validator.mjs`, `scripts/lib/project-inspector.mjs`, validator and CLI contract tests.

### Important 4 — Component-system policy enforcement

- Added foundation-source conflict checks and enhancer-source checks while allowing `project`, `foundation`, `custom`, the declared foundation, the declared enhancer, and the `enhancer` alias when an enhancer exists.
- Rejected Recharts, TanStack Table, Lucide, Motion, and Sonner package identities as `enhancer`; they remain dependency entries.
- Enforced `forms`/`controls`/`overlay` → `interactive` and `table`/`chart`/`metrics` → `data` as errors. `data` or `async` lifecycle-state omissions remain clear warnings and become blocking under `--strict`.
- Corrected `valid-plan.json` so Recharts is a dependency behind a project component, not an enhancer.
- Added direct coverage for multiple enhancers, missing interactive accessibility, foundation conflict, enhancer misuse, undeclared enhancer source, `rejectedCandidates`, async-only state checks, and strict warning exit behavior.
- Files: plan validator, validator/CLI tests, `valid-plan.json`, component-selection reference, design spec.

### Important 5 — Project inspection truthfulness

- Tailwind detection now requires a Tailwind dependency, a Tailwind config, or a Tailwind CSS directive/import marker; a plain `globals.css` name is insufficient.
- Framework priority now reports Remix ahead of Vite while retaining Vite in `framework.detected`.
- Added `activeFoundation`: exactly one detected system resolves it; multiple systems leave it `null` and emit an explicit conflict warning pending page/import evidence.
- Excluded cache/test/fixture/Skill-internal directories from project evidence. This was added after the representative root CLI exposed a false Tailwind result from the Skill's own fixture.
- Added tests for plain CSS, directive-only Tailwind, Remix + Vite, shadcn + Mantine, corrupted project JSON, and nested fixture isolation.
- Files: project inspector, inspector tests, source-adapters reference, design spec.

### Important 6 — Skill negative routing

- Frontmatter explicitly excludes logic-only React bugs and isolated one-line style edits.
- The router now defines a lightweight path only when a bounded request actually needs component-system or design judgment; exact no-judgment edits skip the workflow.
- Structural tests assert both negative boundaries and the conditional lightweight path.
- Forward scenario results:
  - `修复这个 React reducer 的状态 bug。` → Skill does not trigger; route to ordinary logic debugging without project/component discovery or a Component Plan.
  - `把按钮颜色改成红色。` → with exact target/value and no token or system decision, Skill does not trigger and the full workflow is skipped. If the request instead asks which semantic token/variant should represent danger, only the lightweight path applies.
- Files: `SKILL.md`, `tests/skill-structure.test.mjs`, README, design spec.

### Important 7 — Missing spec coverage

- Added behavior coverage for corrupted JSON, project/Registry no results, multiple enhancers, missing interactive accessibility, invalid CLI arguments/streams, strict warnings, and malformed user types.
- `invalid-plan.json` is exercised both directly and through the CLI.
- Tests execute real library/CLI behavior; wording assertions are limited to the explicitly requested Skill/README structural boundaries.
- Files: all five test files and `valid-plan.json`.

## Minor findings

| Finding | Resolution |
|---|---|
| 1. Tailored missing Registry file error | `registry-file` without `--registry-file` exits `2` with `Option --registry-file is required when --source is registry-file.` on stderr. |
| 2. Literal newline output | Query help, text result, and error paths now emit actual newlines; CLI regression test verifies no backslash-`n` sequence. |
| 3. Validation streams | Validation findings, including invalid JSON-plan structure and strict warnings, stay on stdout; argument/file/JSON parse errors use stderr. |
| 4. Temporary directory cleanup | Every `mkdtemp` test registers `t.after(() => rm(...))`. |
| 5. README installation and verification | Personal installation targets `${CODEX_HOME:-$HOME/.codex}/skills`, refuses and warns on an existing destination, and lists full suite, Skill validator, and all three representative CLIs. |
| 6. Final fit distinction | Candidate/docs/spec use discovery-only `relevanceScore`; final fit remains a separate 100-point rubric. |
| 7. Deferred direct coverage | Added direct `rejectedCandidates`, `--strict`, and stdout/stderr assertions. |

## RED evidence

The untouched base first passed its existing suite: `node --test .agents/skills/component-driven-frontend/tests/*.test.mjs` → exit `0`, 28/28 passed. New behavior tests were then added before runtime/document behavior changes.

| Command | RED result and expected cause |
|---|---|
| `node --test .agents/skills/component-driven-frontend/tests/query-components.test.mjs` | exit `1`; 7 passed, 5 failed. Failures showed legacy/extra Candidate keys, forged `@registry-file` command, and unrelated Registry/project candidates. |
| `node --test .agents/skills/component-driven-frontend/tests/inspect-project.test.mjs` | exit `1`; 6 passed, 3 failed. Plain globals CSS was Tailwind, Remix primary was Vite, and `activeFoundation` was absent. |
| `node --test .agents/skills/component-driven-frontend/tests/validate-component-plan.test.mjs` | exit `1`; 16 passed, 7 failed. Policy errors were missing and malformed capability/state types threw `TypeError`. |
| `node --test .agents/skills/component-driven-frontend/tests/cli-contract.test.mjs` | exit `1`; 5 passed, 5 failed. Query emitted literal `\\n`, Registry-file error was an internal path error, corrupted JSON lacked the contract prefix, invalid query errors used literal `\\n`, and malformed types exited `2`. |
| `node --test .agents/skills/component-driven-frontend/tests/skill-structure.test.mjs` | exit `1`; 3 passed, 2 failed. Negative routing and safe installation/acceptance documentation were absent. |
| `node --test --test-name-pattern='ignores nested test fixtures' .agents/skills/component-driven-frontend/tests/inspect-project.test.mjs` | exit `1`; 0 passed, 1 failed. Root inspection consumed nested fixture CSS as project truth. |

## GREEN evidence

| Command | GREEN result |
|---|---|
| `node --test .agents/skills/component-driven-frontend/tests/query-components.test.mjs` | exit `0`; 12/12 passed. |
| `node --test .agents/skills/component-driven-frontend/tests/inspect-project.test.mjs` | exit `0`; final focused run 10/10 passed. |
| `node --test .agents/skills/component-driven-frontend/tests/validate-component-plan.test.mjs` | exit `0`; 23/23 passed. |
| `node --test .agents/skills/component-driven-frontend/tests/cli-contract.test.mjs` | exit `0`; 10/10 passed. |
| `node --test .agents/skills/component-driven-frontend/tests/skill-structure.test.mjs` | exit `0`; 5/5 passed. |

## Final verification

| Check | Result |
|---|---|
| Full suite: `node --test .agents/skills/component-driven-frontend/tests/*.test.mjs` | exit `0`; 60 tests, 60 passed, 0 failed/cancelled/skipped/todo. |
| Skill validator: `python3 /Users/zhoushengyan/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/component-driven-frontend` | exit `0`; `Skill is valid!` |
| Inspector acceptance CLI | exit `0`; parseable JSON, low-confidence non-React repository result, `styling: []`, `activeFoundation: null`. |
| Registry acceptance CLI (`animated hero`) | exit `0`; parseable JSON, two relevant candidates, stable keys, `installCommand: null`, namespace warnings. |
| Plan validation acceptance CLI (`--strict --json`) | exit `0`; valid, 4 regions, 0 errors, 0 warnings. |
| `git diff --check` | exit `0`, no whitespace errors. |
| Unfinished-marker scan over Skill and README | `rg` exit `1`, meaning zero matches. |

## Files changed

- Runtime: `scripts/lib/component-query.mjs`, `scripts/lib/plan-validator.mjs`, `scripts/lib/project-inspector.mjs`, `scripts/query-components.mjs`.
- Tests/fixtures: `tests/cli-contract.test.mjs`, `tests/inspect-project.test.mjs`, `tests/query-components.test.mjs`, `tests/skill-structure.test.mjs`, `tests/validate-component-plan.test.mjs`, `tests/fixtures/valid-plan.json`.
- Skill/docs: `SKILL.md`, `references/component-selection.md`, `references/source-adapters.md`, `README.md`, authoritative design spec.
- Review record: this report only under `.superpowers/`; no other ledger file changed.

## Self-review

- Re-read every Important and Minor finding against implementation, tests, references, fixtures, README, and the authoritative spec.
- Confirmed all runtime imports are Node built-ins and project inspection uses read/access/stat/readdir only; test fixture writes occur only under temporary directories.
- Confirmed online adapters still only construct quoted `nextActions` and never invoke a package manager or network call.
- Confirmed exact stable Candidate keys and no public `score` field remain; internal lexical arithmetic cannot be confused with the documented 100-point fit rubric.
- Confirmed validator issue paths and stream/exit-code behavior stay machine-consumable for malformed user data.
- Confirmed only the designated report was added under `.superpowers/`.

## Residual concerns

- Rendered desktop/mobile visual QA is not applicable to this deliverable because it is a Skill and deterministic CLI package, not a rendered application.
- Neutral Registry files intentionally cannot produce an install command until a real namespace is independently verified.
- A multi-foundation project intentionally leaves `activeFoundation` unresolved; the consuming Skill must inspect page/import evidence before selection.
