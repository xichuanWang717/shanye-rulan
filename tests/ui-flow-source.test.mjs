import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read = name => readFile(new URL(`../${name}`, import.meta.url), 'utf8');

test('pavilion completion is separated from opening the workshop', async () => {
  const pavilion = await read('pavilion.js');
  const world = await read('world.js');
  assert.match(pavilion, /pavilion-flight-complete/);
  assert.doesNotMatch(pavilion, /dispatchEvent\(new Event\('open-workshop'\)\)/);
  assert.match(world, /你已经找到六段记忆/);
  assert.match(world, /pavilion-flight-complete/);
});

test('workshop offers mutually exclusive manual and automatic modes', async () => {
  const process = await read('batik-process.js');
  assert.match(process, /process-mode-manual/);
  assert.match(process, /process-mode-auto/);
  assert.match(process, /亲手完成/);
  assert.match(process, /自动演示/);
  assert.match(process, /switch-process-mode/);
  assert.match(process, /scheduleNextAutoStep/);
  assert.match(process, /clearTimeout\(autoTimer\)/);
});

test('restart is confirmed and delegates clearing to the journey state', async () => {
  const world = await read('world.js');
  assert.match(world, /restart-confirm/);
  assert.match(world, /resetJourney\(\)/);
  assert.match(world, /清空并重新开始/);
});

test('entry points use new cache versions for every changed module', async () => {
  const index = await read('index.html');
  const world = await read('world.js');
  const journey = await read('journey.js');
  const language = await read('language.js');
  assert.match(index, /world\.js\?v=74/);
  assert.match(index, /language\.js\?v=74/);
  assert.match(world, /pavilion\.js\?v=72/);
  assert.match(world, /journey\.js\?v=73/);
  assert.match(world, /story-thread\.js\?v=72/);
  assert.match(journey, /exploration-progress\.js\?v=72/);
  assert.match(journey, /batik-process\.js\?v=73/);
  assert.match(language, /english\.js\?v=74/);
});

