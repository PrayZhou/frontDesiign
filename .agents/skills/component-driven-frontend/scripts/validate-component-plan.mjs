#!/usr/bin/env node
import { parseArgs, printJson } from './lib/cli.mjs';
import { validateComponentPlan } from './lib/plan-validator.mjs';
import { readJsonFile } from './lib/project-inspector.mjs';

const help = 'Usage: validate-component-plan.mjs --file <path> [--json] [--strict] [--help]\n';

try {
  const options = parseArgs(process.argv.slice(2), {
    file: { type: 'string' },
    json: { type: 'boolean' },
    strict: { type: 'boolean' },
    help: { type: 'boolean' },
  });

  if (options.help) {
    process.stdout.write(help);
  } else if (!options.file) {
    throw new Error('Option --file is required');
  } else {
    const result = validateComponentPlan(await readJsonFile(options.file));
    if (options.json) {
      printJson(result);
    } else {
      process.stdout.write(`${result.valid ? 'valid' : 'invalid'}: ${result.summary.regionCount} regions, ${result.summary.errorCount} errors, ${result.summary.warningCount} warnings\n`);
      for (const item of [...result.errors, ...result.warnings]) process.stdout.write(`${item.code} ${item.path}: ${item.message}\n`);
    }
    if (!result.valid || (options.strict && result.warnings.length > 0)) process.exitCode = 1;
  }
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 2;
}
