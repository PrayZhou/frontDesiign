import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  buildOnlineSourceResult,
  normalizeRegistry,
  queryProject,
  queryRegistryFile,
  scoreCandidate,
  tokenize,
} from '../scripts/lib/component-query.mjs';

const fixtures = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures');
const registryPath = path.join(fixtures, 'registry.json');
const nextFixture = path.join(fixtures, 'next-shadcn');
const stableCandidateKeys = [
  'capabilities',
  'dependencies',
  'description',
  'docsUrl',
  'id',
  'installCommand',
  'name',
  'registryDependencies',
  'relevanceScore',
  'source',
  'warnings',
];

test('normalizes a trusted registry namespace into the stable Candidate contract', async () => {
  const result = await queryRegistryFile(registryPath, 'animated hero', 'magicui');

  assert.equal(result.status, 'ok');
  assert.equal(result.candidates[0].id, 'magicui/animated-grid-pattern');
  assert.ok(result.candidates[0].capabilities.includes('animation'));
  assert.ok(result.candidates[0].installCommand.includes('@magicui/animated-grid-pattern'));
  assert.deepEqual(Object.keys(result.candidates[0]).sort(), stableCandidateKeys);
  assert.equal(result.candidates[0].docsUrl, null);
  assert.equal(typeof result.candidates[0].relevanceScore, 'number');
  assert.equal('score' in result.candidates[0], false);
});

test('does not invent an install namespace for a neutral Registry file', async () => {
  const result = await queryRegistryFile(registryPath, 'hero', 'registry-file');

  assert.equal(result.candidates[0].installCommand, null);
  assert.ok(result.candidates[0].warnings.some((warning) => warning.includes('trusted namespace')));
  assert.ok(result.warnings.some((warning) => warning.includes('trusted namespace')));
});

test('extracts normalized tokens and accepts an individual registry item', () => {
  assert.deepEqual(tokenize('Data_Table / chart'), ['data', 'table', 'chart']);
  const candidates = normalizeRegistry({ name: 'toast', type: 'registry:component', description: 'Feedback overlay' }, 'shadcn');
  assert.equal(candidates[0].id, 'shadcn/toast');
  assert.ok(candidates[0].capabilities.includes('feedback'));
  assert.ok(candidates[0].capabilities.includes('overlay'));
});

test('ranks exact capability and name matches above description-only matches', () => {
  const exact = scoreCandidate({ name: 'data-table', capabilities: ['table'], description: '' }, 'data table', {});
  const loose = scoreCandidate({ name: 'card', capabilities: [], description: 'Can contain tabular content' }, 'data table', {});
  assert.ok(exact > loose);
});

test('matches singular chart capability tokens without penalizing installed dependencies', () => {
  const candidate = { name: 'chart', capabilities: ['charts'], description: '', dependencies: ['recharts'] };
  assert.equal(scoreCandidate(candidate, 'chart', { dependencies: ['recharts'] }), 77);
});

test('matches singular table query tokens against normalized table capabilities', () => {
  const candidate = { name: 'data-table', capabilities: ['tables'], description: '' };
  assert.equal(scoreCandidate(candidate, 'data table', {}), 92);
});

test('queries existing project components without accessing the network', async () => {
  const result = await queryProject(nextFixture, 'button');

  assert.equal(result.status, 'ok');
  assert.equal(result.candidates[0].source, 'project');
  assert.equal(result.candidates[0].name, 'button');
  assert.deepEqual(Object.keys(result.candidates[0]).sort(), stableCandidateKeys);
  assert.equal(result.candidates[0].docsUrl, null);
});

test('returns no Registry candidates when no name, capability, or description matches', async () => {
  const result = await queryRegistryFile(registryPath, 'unrelated', 'registry-file');

  assert.deepEqual(result.candidates, []);
});

test('returns no project candidates when only the in-project bonus would match', async () => {
  const result = await queryProject(nextFixture, 'unrelated');

  assert.deepEqual(result.candidates, []);
});

test('returns an honest command plan for online sources', async () => {
  const result = await buildOnlineSourceResult('aceternity', 'hero', nextFixture);

  assert.equal(result.status, 'requires-command');
  assert.equal(result.candidates.length, 0);
  assert.ok(result.nextActions.some((item) => item.command.includes('shadcn')));
});

test('shell-quotes online query text containing command separators', async () => {
  const result = await buildOnlineSourceResult('magicui', 'hero; echo INJECTED', nextFixture);

  assert.equal(result.nextActions[0].command, "npx shadcn@latest search @magicui -q 'hero; echo INJECTED'");
});

test('warns when an online registry namespace is not configured locally', async () => {
  const result = await buildOnlineSourceResult('magicui', 'hero', nextFixture);

  assert.ok(result.warnings.some((warning) => warning.includes('https://ui.shadcn.com/docs/registry/registry-home')));
});
