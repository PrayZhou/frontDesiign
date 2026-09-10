import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { inspectProject } from '../scripts/lib/project-inspector.mjs';

const fixtures = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures');

test('detects Next.js, pnpm, Tailwind, shadcn registries, and existing components', async () => {
  const result = await inspectProject(path.join(fixtures, 'next-shadcn'));
  assert.equal(result.framework.primary, 'next');
  assert.equal(result.packageManager, 'pnpm');
  assert.ok(result.styling.includes('tailwind'));
  assert.ok(result.designSystems.includes('shadcn'));
  assert.deepEqual(result.shadcn.registries, ['@aceternity']);
  assert.ok(result.components.some((item) => item.name === 'button'));
  assert.equal(result.confidence, 'high');
});

test('keeps an existing Mantine foundation instead of recommending shadcn', async () => {
  const result = await inspectProject(path.join(fixtures, 'vite-mantine'));
  assert.equal(result.framework.primary, 'vite');
  assert.ok(result.designSystems.includes('mantine'));
  assert.ok(!result.designSystems.includes('shadcn'));
});

test('returns low-confidence warnings for an empty directory', async () => {
  const result = await inspectProject(path.join(fixtures, 'empty'));
  assert.equal(result.confidence, 'low');
  assert.ok(result.warnings.length > 0);
});

test('skips .turbo cache components during directory traversal', async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), 'project-inspector-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, 'src/components/.turbo'), { recursive: true });
  await writeFile(path.join(root, 'package.json'), '{"dependencies":{"vite":"5.0.0"}}');
  await writeFile(path.join(root, 'src/components/VisibleCard.tsx'), 'export const VisibleCard = () => null;');
  await writeFile(path.join(root, 'src/components/.turbo/GeneratedCard.tsx'), 'export const GeneratedCard = () => null;');

  const result = await inspectProject(root);

  assert.deepEqual(result.components.map((component) => component.name), ['visible-card']);
});

test('does not infer Tailwind from a plain globals.css file', async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), 'project-inspector-plain-css-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, 'src/app'), { recursive: true });
  await writeFile(path.join(root, 'package.json'), '{"dependencies":{"react":"19.0.0"}}');
  await writeFile(path.join(root, 'src/app/globals.css'), ':root { color-scheme: light; }');

  const result = await inspectProject(root);

  assert.equal(result.styling.includes('tailwind'), false);
});

test('detects Tailwind from CSS directives without package evidence', async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), 'project-inspector-tailwind-css-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, 'src/app'), { recursive: true });
  await writeFile(path.join(root, 'package.json'), '{"dependencies":{"react":"19.0.0"}}');
  await writeFile(path.join(root, 'src/app/globals.css'), '@import "tailwindcss";');

  const result = await inspectProject(root);

  assert.ok(result.styling.includes('tailwind'));
});

test('prefers Remix over Vite while preserving Vite as a framework signal', async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), 'project-inspector-remix-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeFile(path.join(root, 'package.json'), JSON.stringify({
    dependencies: { '@remix-run/react': '2.0.0', react: '19.0.0' },
    devDependencies: { '@remix-run/dev': '2.0.0', vite: '6.0.0' },
  }));

  const result = await inspectProject(root);

  assert.equal(result.framework.primary, 'remix');
  assert.ok(result.framework.detected.includes('vite'));
});

test('reports a shadcn and Mantine conflict without guessing the active foundation', async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), 'project-inspector-foundation-conflict-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeFile(path.join(root, 'package.json'), JSON.stringify({
    dependencies: { '@mantine/core': '8.0.0', react: '19.0.0' },
  }));
  await writeFile(path.join(root, 'components.json'), '{}');

  const result = await inspectProject(root);

  assert.deepEqual(result.designSystems, ['shadcn', 'mantine']);
  assert.equal(result.activeFoundation, null);
  assert.ok(result.warnings.some((warning) => warning.includes('Multiple foundation systems detected')));
});

test('turns corrupted project JSON into inspection warnings', async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), 'project-inspector-corrupt-json-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeFile(path.join(root, 'package.json'), '{ invalid json');

  const result = await inspectProject(root);

  assert.equal(result.confidence, 'low');
  assert.ok(result.warnings.some((warning) => warning.includes('Could not parse package.json')));
});

test('ignores nested test fixtures when detecting project styling', async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), 'project-inspector-nested-fixture-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, 'tests/fixtures/example/src'), { recursive: true });
  await writeFile(path.join(root, 'package.json'), '{"dependencies":{"react":"19.0.0"}}');
  await writeFile(path.join(root, 'tests/fixtures/example/src/globals.css'), '@import "tailwindcss";');

  const result = await inspectProject(root);

  assert.equal(result.styling.includes('tailwind'), false);
  assert.deepEqual(result.themeFiles, []);
});
