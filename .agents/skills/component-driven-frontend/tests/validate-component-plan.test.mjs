import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { validateComponentPlan } from '../scripts/lib/plan-validator.mjs';

const fixtures = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures');
const validPlan = JSON.parse(await readFile(path.join(fixtures, 'valid-plan.json'), 'utf8'));
const invalidPlan = JSON.parse(await readFile(path.join(fixtures, 'invalid-plan.json'), 'utf8'));

test('accepts one foundation, explicit capability dependencies, states, and accessibility', () => {
  const result = validateComponentPlan(validPlan);

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
  assert.equal(result.summary.regionCount, 3);
});

test('rejects design intent without a core task', () => {
  const plan = structuredClone(validPlan);
  delete plan.designIntent.coreTask;

  assert.ok(validateComponentPlan(plan).errors.some((item) => (
    item.code === 'design-intent-field-required' && item.path === '/designIntent/coreTask'
  )));
});

test('rejects multiple foundation systems', () => {
  const plan = structuredClone(validPlan);
  plan.foundation = ['shadcn', 'mantine'];

  assert.ok(validateComponentPlan(plan).errors.some((item) => item.code === 'multiple-foundations'));
});

test('rejects multiple visual enhancers', () => {
  const plan = structuredClone(validPlan);
  plan.enhancer = ['magicui', 'aceternity'];

  assert.ok(validateComponentPlan(plan).errors.some((item) => item.code === 'multiple-enhancers'));
});

test('rejects a known foundation source that conflicts with the declared foundation', () => {
  const plan = structuredClone(validPlan);
  plan.foundation = 'mantine';
  plan.regions[0].selection.source = 'shadcn';

  assert.ok(validateComponentPlan(plan).errors.some((item) => item.code === 'foundation-source-conflict'));
});

test('allows project, foundation, and declared enhancer selection sources', () => {
  const plan = structuredClone(validPlan);
  plan.enhancer = 'magicui';
  plan.regions[0].selection.source = 'foundation';
  plan.regions[1].selection.source = 'project';
  plan.regions[2].selection.source = 'magicui';

  assert.equal(validateComponentPlan(plan).errors.some((item) => item.code.endsWith('source-conflict')), false);
});

test('allows the exact declared foundation as a selection source', () => {
  const plan = structuredClone(validPlan);
  plan.regions[0].selection.source = 'shadcn';

  assert.equal(validateComponentPlan(plan).errors.some((item) => item.code === 'foundation-source-conflict'), false);
});

test('rejects a visual enhancer source that is not the declared enhancer', () => {
  const plan = structuredClone(validPlan);
  plan.enhancer = 'magicui';
  plan.regions[0].selection.source = 'aceternity';

  assert.ok(validateComponentPlan(plan).errors.some((item) => item.code === 'enhancer-source-conflict'));
});

test('rejects a capability library declared as the visual enhancer', () => {
  const plan = structuredClone(validPlan);
  plan.enhancer = 'recharts';

  assert.ok(validateComponentPlan(plan).errors.some((item) => item.code === 'capability-library-as-enhancer'));
});

test('rejects a custom component without a fallback reason', () => {
  const plan = structuredClone(validPlan);
  plan.regions[0].selection.source = 'custom';
  delete plan.regions[0].customReason;

  assert.ok(validateComponentPlan(plan).errors.some((item) => item.code === 'custom-reason-required'));
});

test('rejects a custom component without direct rejectedCandidates evidence', () => {
  const plan = structuredClone(validPlan);
  plan.regions[0].selection.source = 'custom';
  plan.regions[0].customReason = 'Verified candidates cannot meet the keyboard interaction contract.';
  delete plan.regions[0].rejectedCandidates;

  assert.ok(validateComponentPlan(plan).errors.some((item) => item.code === 'rejected-candidates-required'));
});

test('rejects a region with an empty selection object', () => {
  const plan = structuredClone(validPlan);
  plan.regions[0].selection = {};

  assert.ok(validateComponentPlan(plan).errors.some((item) => item.code === 'selection-source-required'));
});

test('rejects a region with an empty selection source', () => {
  const plan = structuredClone(validPlan);
  plan.regions[0].selection.source = ' ';

  assert.ok(validateComponentPlan(plan).errors.some((item) => item.code === 'selection-source-required'));
});

test('rejects a region without a selected component', () => {
  const plan = structuredClone(validPlan);
  delete plan.regions[0].selection.component;

  assert.ok(validateComponentPlan(plan).errors.some((item) => item.code === 'selection-component-required'));
});

test('warns when a data region omits applicable async states', () => {
  const plan = structuredClone(validPlan);
  plan.regions[1].states = ['success'];

  assert.ok(validateComponentPlan(plan).warnings.some((item) => item.code === 'async-states-incomplete'));
});

test('warns when an async-only region omits lifecycle states', () => {
  const plan = structuredClone(validPlan);
  plan.regions[0].capabilities = ['async'];
  plan.regions[0].states = ['success'];

  assert.ok(validateComponentPlan(plan).warnings.some((item) => item.code === 'async-states-incomplete'));
});

test('rejects interactive regions with missing accessibility behavior', () => {
  const plan = structuredClone(validPlan);
  delete plan.regions[0].accessibility.keyboard;

  assert.ok(validateComponentPlan(plan).errors.some((item) => (
    item.code === 'interactive-accessibility-required' && item.path.endsWith('/accessibility/keyboard')
  )));
});

test('requires forms, controls, and overlays to declare interactive capability', () => {
  for (const capability of ['forms', 'controls', 'overlay']) {
    const plan = structuredClone(validPlan);
    plan.regions[0].capabilities = [capability];

    assert.ok(validateComponentPlan(plan).errors.some((item) => item.code === 'interactive-capability-required'));
  }
});

test('requires tables, charts, and metrics to declare data capability', () => {
  for (const capability of ['table', 'chart', 'metrics']) {
    const plan = structuredClone(validPlan);
    plan.regions[1].capabilities = [capability];

    assert.ok(validateComponentPlan(plan).errors.some((item) => item.code === 'data-capability-required'));
  }
});

test('validates malformed capability types without throwing', () => {
  const plan = structuredClone(validPlan);
  plan.regions[0].capabilities = 'data';

  const result = validateComponentPlan(plan);

  assert.equal(result.valid, false);
  assert.ok(result.errors.some((item) => item.path === '/regions/0/capabilities'));
});

test('validates malformed state, selection, accessibility, and dependency types without throwing', () => {
  const cases = [
    (plan) => { plan.regions[1].states = { success: true }; },
    (plan) => { plan.regions[0].selection = 'foundation'; },
    (plan) => { plan.regions[0].accessibility = 'keyboard'; },
    (plan) => { plan.dependencies = 'recharts'; },
  ];

  for (const mutate of cases) {
    const plan = structuredClone(validPlan);
    mutate(plan);
    const result = validateComponentPlan(plan);
    assert.equal(result.valid, false);
    assert.ok(result.errors.length > 0);
  }
});

test('exercises the shipped invalid plan fixture', () => {
  const result = validateComponentPlan(invalidPlan);

  assert.equal(result.valid, false);
  assert.ok(result.errors.some((item) => item.code === 'multiple-foundations'));
  assert.ok(result.errors.some((item) => item.code === 'multiple-enhancers'));
  assert.ok(result.errors.some((item) => item.code === 'rejected-candidates-required'));
});

test('prints help with a newline and exits zero', () => {
  const script = path.join(fixtures, '..', '..', 'scripts', 'validate-component-plan.mjs');
  const result = spawnSync(process.execPath, [script, '--help'], { encoding: 'utf8' });

  assert.equal(result.status, 0);
  assert.equal(result.stdout, 'Usage: validate-component-plan.mjs --file <path> [--json] [--strict] [--help]\n');
  assert.equal(result.stderr, '');
});
