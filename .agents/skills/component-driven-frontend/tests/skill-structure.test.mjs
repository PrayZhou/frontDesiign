import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillPath = path.join(skillRoot, 'SKILL.md');
const readmePath = path.resolve(skillRoot, '..', '..', '..', 'README.md');

const requiredPaths = [
  'references/design-intent.md',
  'references/component-selection.md',
  'references/source-adapters.md',
  'references/composition-patterns.md',
  'references/visual-qa.md',
  'scripts/inspect-project.mjs',
  'scripts/query-components.mjs',
  'scripts/validate-component-plan.mjs',
];

function frontmatter(text) {
  return text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
}

test('has valid frontmatter with a trigger-only description', async () => {
  const text = await readFile(skillPath, 'utf8');
  assert.match(text, /^---\nname: component-driven-frontend\ndescription: Use when /);
  assert.doesNotMatch(frontmatter(text), /then|workflow|first .* then/i);
});

test('references every required guide and executable', async () => {
  const skillText = await readFile(skillPath, 'utf8');

  for (const relativePath of requiredPaths) {
    await access(path.join(skillRoot, relativePath));
    assert.ok(skillText.includes(relativePath), `SKILL.md must link ${relativePath}`);
  }
});

test('keeps the router concise', async () => {
  const skillText = await readFile(skillPath, 'utf8');
  const words = skillText.trim().split(/\s+/).length;
  assert.ok(words < 900, `SKILL.md has ${words} words`);
});

test('frontmatter and routing exclude logic-only bugs and isolated one-line style edits', async () => {
  const text = await readFile(skillPath, 'utf8');
  const metadata = frontmatter(text);

  assert.match(metadata, /logic-only React bugs/i);
  assert.match(metadata, /isolated one-line style edits/i);
  assert.match(text, /component-system or design judgment/i);
  assert.match(text, /lightweight path/i);
});

test('documents safe personal installation and every acceptance command', async () => {
  const readme = await readFile(readmePath, 'utf8');

  assert.ok(readme.includes('${CODEX_HOME:-$HOME/.codex}/skills'));
  assert.match(readme, /already exists|existing destination/i);
  assert.ok(readme.includes('quick_validate.py'));
  assert.ok(readme.includes('inspect-project.mjs --root . --json'));
  assert.ok(readme.includes('query-components.mjs --source registry-file'));
  assert.ok(readme.includes('validate-component-plan.mjs --file'));
});
