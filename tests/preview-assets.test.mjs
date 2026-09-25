import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

const indexUrl = new URL('../index.html', import.meta.url);

test('preview does not reference missing local stylesheets or images', async () => {
  const rootUrl = new URL('../', import.meta.url);
  const html = await readFile(indexUrl, 'utf8');
  const scripts = (await readdir(rootUrl))
    .filter((name) => name.endsWith('.js'));
  const sources = [html];
  for (const script of scripts) sources.push(await readFile(new URL(script, rootUrl), 'utf8'));

  const references = sources.flatMap((source) => [
    ...[...source.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]),
    ...[...source.matchAll(/(['"`])(\.\/[^'"`]+\.(?:png|jpe?g|webp|svg|mp3|wav|ogg))\1/gi)].map((match) => match[2]),
  ])
    .map((reference) => reference.split('?')[0])
    .filter((reference) => !/^(?:https?:|#)/.test(reference))
    .filter((reference) => /\.(?:css|png|jpe?g|webp|svg)$/i.test(reference));

  const missing = [];
  for (const reference of references) {
    if (reference.includes('${')) continue;
    const resourceUrl = new URL(reference, rootUrl);
    try {
      await readFile(resourceUrl);
    } catch {
      missing.push(reference);
    }
  }

  assert.deepEqual(missing, [], `Missing preview assets: ${missing.join(', ')}`);
});
