import test from 'node:test';
import assert from 'node:assert/strict';

class StorageMock {
  constructor(initial = {}) { this.data = new Map(Object.entries(initial)); }
  getItem(key) { return this.data.has(key) ? this.data.get(key) : null; }
  setItem(key, value) { this.data.set(key, String(value)); }
  removeItem(key) { this.data.delete(key); }
}

async function loadState(initial = {}) {
  globalThis.localStorage = new StorageMock(initial);
  globalThis.dispatchEvent = () => true;
  globalThis.CustomEvent = class { constructor(type, init = {}) { this.type = type; this.detail = init.detail; } };
  return import(`../journey-state.js?case=${Math.random()}`);
}

test('restores valid saved memories and ignores unknown keys', async () => {
  const state = await loadState({
    'indigo-memories-v1': JSON.stringify({ flower: true, unknown: true, fish: false })
  });
  assert.deepEqual(state.getCollectedMemories(), ['flower']);
});

test('damaged saved data safely becomes an empty journal', async () => {
  const state = await loadState({ 'indigo-memories-v1': '{broken' });
  assert.deepEqual(state.getCollectedMemories(), []);
});

test('collecting the same memory twice only counts once', async () => {
  const state = await loadState();
  assert.equal(state.collectMemory('stream'), true);
  assert.equal(state.collectMemory('stream'), false);
  assert.deepEqual(state.getCollectedMemories(), ['stream']);
});

test('reset clears memories but preserves the language preference', async () => {
  const state = await loadState({
    'indigo-memories-v1': JSON.stringify({ flower: true }),
    'shanye-language': 'en'
  });
  state.resetJourney();
  assert.deepEqual(state.getCollectedMemories(), []);
  assert.equal(globalThis.localStorage.getItem('indigo-memories-v1'), null);
  assert.equal(globalThis.localStorage.getItem('shanye-language'), 'en');
});

test('completion requires all six known memories', async () => {
  const state = await loadState();
  for (const key of ['flower', 'stream', 'fish', 'butterfly', 'tree']) state.collectMemory(key);
  assert.equal(state.isCollectionComplete(), false);
  state.collectMemory('bird');
  assert.equal(state.isCollectionComplete(), true);
});

