export const MEMORY_KEYS = Object.freeze(['flower','stream','fish','butterfly','tree','bird']);
const STORAGE_KEY = 'indigo-memories-v1';

function readSaved() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return new Set(MEMORY_KEYS.filter(key => value?.[key] === true));
  } catch {
    return new Set();
  }
}

const collected = readSaved();

function announce(type, detail) {
  if (typeof dispatchEvent === 'function' && typeof CustomEvent === 'function') {
    dispatchEvent(new CustomEvent(type, { detail }));
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries([...collected].map(key => [key, true]))));
  } catch {}
}

export function getCollectedMemories() { return MEMORY_KEYS.filter(key => collected.has(key)); }
export function hasCollectedMemory(key) { return collected.has(key); }
export function isCollectionComplete() { return collected.size === MEMORY_KEYS.length; }

export function collectMemory(key) {
  if (!MEMORY_KEYS.includes(key) || collected.has(key)) return false;
  collected.add(key);
  persist();
  announce('memory-collected', key);
  announce('journey-progress-changed', getCollectedMemories());
  return true;
}

export function resetJourney() {
  collected.clear();
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
  announce('journey-progress-changed', []);
  announce('journey-reset', null);
}

