import assert from 'node:assert/strict';
import { execFile as execFileCallback } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const execFile = promisify(execFileCallback);
const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const skillDirectory = path.join(testDirectory, '..');
const scriptsDirectory = path.join(skillDirectory, 'scripts');
const fixturesDirectory = path.join(testDirectory, 'fixtures');
const nextFixture = path.join(fixturesDirectory, 'next-shadcn');
const examplePlan = path.join(skillDirectory, 'examples', 'component-plan.example.json');
const invalidPlan = path.join(fixturesDirectory, 'invalid-plan.json');
const sentinelPreload = path.join(fixturesDirectory, 'help-read-sentinel.cjs');
const validPlan = JSON.parse(await readFile(path.join(fixturesDirectory, 'valid-plan.json'), 'utf8'));

async function run(command, args, options = {}) {
  try {
    const result = await execFile(command, args, { encoding: 'utf8', ...options });
    return { code: 0, stdout: result.stdout, stderr: result.stderr };
  } catch (error) {
    return { code: error.code, stdout: error.stdout, stderr: error.stderr };
  }
}

async function runJson(script, args) {
  const result = await run(process.execPath, [path.join(scriptsDirectory, script), ...args]);
  assert.equal(result.code, 0, result.stderr);
  return JSON.parse(result.stdout);
}

async function writeTemporaryPlan(t, name, plan) {
  const directory = await mkdtemp(path.join(tmpdir(), `component-driven-frontend-${name}-`));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const file = path.join(directory, 'plan.json');
  await writeFile(file, JSON.stringify(plan));
  return file;
}

test('all CLIs expose help without loading project files', async (t) => {
  const sentinelDirectory = await mkdtemp(path.join(tmpdir(), 'component-driven-frontend-help-'));
  t.after(() => rm(sentinelDirectory, { recursive: true, force: true }));
  const helpRequests = [
    { script: 'inspect-project.mjs', args: ['--help', '--root', sentinelDirectory] },
    {
      script: 'query-components.mjs',
      args: ['--help', '--source', 'project', '--root', sentinelDirectory, '--query', 'button'],
    },
    {
      script: 'query-components.mjs',
      args: [
        '--help', '--source', 'registry-file', '--registry-file', path.join(sentinelDirectory, 'registry.json'),
        '--query', 'button',
      ],
    },
    {
      script: 'validate-component-plan.mjs',
      args: ['--help', '--file', path.join(sentinelDirectory, 'component-plan.json')],
    },
  ];

  for (const { script, args } of helpRequests) {
    const result = await run(process.execPath, [
      '--require', sentinelPreload, path.join(scriptsDirectory, script), ...args,
    ], {
      env: { ...process.env, COMPONENT_DRIVEN_FRONTEND_SENTINEL: sentinelDirectory },
    });
    assert.equal(result.code, 0, `${script}: ${result.stderr}`);
    assert.match(result.stdout, /Usage:/);
    assert.equal(result.stderr, '');
  }
});

test('inspector output can inform a project component query', async () => {
  const inspection = await runJson('inspect-project.mjs', ['--root', nextFixture, '--json']);
  const query = await runJson('query-components.mjs', [
    '--source', 'project', '--root', nextFixture, '--query', 'button', '--json',
  ]);

  assert.equal(inspection.designSystems[0], 'shadcn');
  assert.equal(query.candidates[0].name, 'button');
});

test('the shipped example plan validates cleanly in strict mode', async () => {
  const validator = path.join(scriptsDirectory, 'validate-component-plan.mjs');
  const result = await run(process.execPath, [validator, '--file', examplePlan, '--strict', '--json']);

  assert.equal(result.code, 0, result.stderr);
  const validation = JSON.parse(result.stdout);
  assert.equal(validation.valid, true);
  assert.deepEqual(validation.warnings, []);
});

test('query text output ends with a real newline', async () => {
  const result = await run(process.execPath, [
    path.join(scriptsDirectory, 'query-components.mjs'),
    '--source', 'project', '--root', nextFixture, '--query', 'button',
  ]);

  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout, 'ok: 1 candidates\n');
  assert.equal(result.stdout.includes('\\n'), false);
  assert.equal(result.stderr, '');
});

test('registry-file without --registry-file reports a tailored argument error', async () => {
  const result = await run(process.execPath, [
    path.join(scriptsDirectory, 'query-components.mjs'),
    '--source', 'registry-file', '--query', 'button', '--json',
  ]);

  assert.equal(result.code, 2);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, 'Option --registry-file is required when --source is registry-file.\n');
});

test('invalid CLI arguments use stderr and leave stdout empty', async () => {
  const cases = [
    { script: 'inspect-project.mjs', args: ['--unknown'] },
    { script: 'query-components.mjs', args: ['--unknown'] },
    { script: 'validate-component-plan.mjs', args: ['--unknown'] },
  ];

  for (const item of cases) {
    const result = await run(process.execPath, [path.join(scriptsDirectory, item.script), ...item.args]);
    assert.equal(result.code, 2, item.script);
    assert.equal(result.stdout, '', item.script);
    assert.match(result.stderr, /Unknown option: --unknown\n$/, item.script);
    assert.equal(result.stderr.includes('\\n'), false, item.script);
  }
});

test('corrupted Registry and plan JSON use runtime-error streams', async (t) => {
  const directory = await mkdtemp(path.join(tmpdir(), 'component-driven-frontend-corrupt-json-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const corruptFile = path.join(directory, 'corrupt.json');
  await writeFile(corruptFile, '{ invalid json');
  const cases = [
    {
      script: 'query-components.mjs',
      args: ['--source', 'registry-file', '--registry-file', corruptFile, '--query', 'button', '--json'],
    },
    { script: 'validate-component-plan.mjs', args: ['--file', corruptFile, '--json'] },
  ];

  for (const item of cases) {
    const result = await run(process.execPath, [path.join(scriptsDirectory, item.script), ...item.args]);
    assert.equal(result.code, 2, item.script);
    assert.equal(result.stdout, '', item.script);
    assert.match(result.stderr, /Could not parse JSON file:/, item.script);
    assert.match(result.stderr, /\n$/, item.script);
  }
});

test('malformed plan types return structured JSON findings with exit 1', async (t) => {
  const plan = structuredClone(validPlan);
  plan.regions[0].capabilities = 'data';
  const file = await writeTemporaryPlan(t, 'malformed-type', plan);
  const result = await run(process.execPath, [
    path.join(scriptsDirectory, 'validate-component-plan.mjs'), '--file', file, '--json',
  ]);

  assert.equal(result.code, 1, result.stderr);
  assert.equal(result.stderr, '');
  const validation = JSON.parse(result.stdout);
  assert.equal(validation.valid, false);
  assert.ok(validation.errors.some((item) => item.path === '/regions/0/capabilities'));
});

test('the invalid-plan fixture emits validation findings on stdout', async () => {
  const result = await run(process.execPath, [
    path.join(scriptsDirectory, 'validate-component-plan.mjs'), '--file', invalidPlan, '--json',
  ]);

  assert.equal(result.code, 1, result.stderr);
  assert.equal(result.stderr, '');
  const validation = JSON.parse(result.stdout);
  assert.equal(validation.valid, false);
  assert.ok(validation.errors.length > 0);
});

test('--strict turns structured warnings into exit 1 without using stderr', async (t) => {
  const plan = structuredClone(validPlan);
  plan.regions[1].states = ['success'];
  const file = await writeTemporaryPlan(t, 'strict-warning', plan);
  const result = await run(process.execPath, [
    path.join(scriptsDirectory, 'validate-component-plan.mjs'), '--file', file, '--strict', '--json',
  ]);

  assert.equal(result.code, 1, result.stderr);
  assert.equal(result.stderr, '');
  const validation = JSON.parse(result.stdout);
  assert.equal(validation.valid, true);
  assert.ok(validation.warnings.some((item) => item.code === 'async-states-incomplete'));
});
