import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const rootUrl = new URL('../', import.meta.url);

test('browser entry modules have a complete local dependency graph', async () => {
  const pending = ['language.js', 'world.js'];
  const visited = new Set();
  const missing = [];

  while (pending.length) {
    const moduleName = pending.pop();
    if (visited.has(moduleName)) continue;
    visited.add(moduleName);

    const moduleUrl = new URL(moduleName, rootUrl);
    try {
      await access(moduleUrl);
    } catch {
      missing.push(moduleName);
      continue;
    }

    const source = await readFile(moduleUrl, 'utf8');
    for (const match of source.matchAll(/(?:from\s*|import\s*)['"](\.\/[^'"?]+)(?:\?[^'"]*)?['"]/g)) {
      pending.push(new URL(match[1], moduleUrl).pathname.split('/').pop());
    }
  }

  assert.deepEqual(missing.sort(), [], `Missing browser modules: ${missing.sort().join(', ')}`);
});
