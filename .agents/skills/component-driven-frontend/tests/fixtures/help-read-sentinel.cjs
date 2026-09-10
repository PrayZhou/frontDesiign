const fs = require('node:fs');
const path = require('node:path');

const sentinel = path.resolve(process.env.COMPONENT_DRIVEN_FRONTEND_SENTINEL);

function targetsSentinel(value) {
  if (typeof value !== 'string' && !Buffer.isBuffer(value) && !(value instanceof URL)) return false;
  const resolved = path.resolve(String(value));
  return resolved === sentinel || resolved.startsWith(`${sentinel}${path.sep}`);
}

for (const method of ['access', 'lstat', 'readdir', 'readFile', 'realpath', 'stat']) {
  const original = fs.promises[method];
  fs.promises[method] = async function sentry(...args) {
    if (targetsSentinel(args[0])) {
      process.stderr.write(`Unexpected help-path filesystem access: ${method} ${args[0]}\n`);
      process.exit(97);
    }
    return original.apply(this, args);
  };
}
