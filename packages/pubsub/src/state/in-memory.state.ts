import type { StateStore, StateUpdater } from './state.interface.js';

interface StateEntry<TValue> {
  readonly value: TValue;
  readonly expiresAt?: number;
}

export const createInMemoryStateStore = (): StateStore => {
  const store = new Map<string, StateEntry<unknown>>();

  const isExpired = (entry: StateEntry<unknown>): boolean =>
    entry.expiresAt !== undefined && entry.expiresAt <= Date.now();

  const readEntry = <TValue>(key: string): StateEntry<TValue> | undefined => {
    const entry = store.get(key) as StateEntry<TValue> | undefined;
    if (!entry) return undefined;

    if (isExpired(entry)) {
      store.delete(key);
      return undefined;
    }

    return entry;
  };

  const get = async <TValue>(key: string): Promise<TValue | undefined> => readEntry<TValue>(key)?.value;

  const set = async <TValue>(key: string, value: TValue, ttlSeconds?: number): Promise<void> => {
    const expiresAt = ttlSeconds !== undefined ? Date.now() + ttlSeconds * 1000 : undefined;
    store.set(key, { value, expiresAt });
  };

  const update = async <TValue>(key: string, updater: StateUpdater<TValue>): Promise<TValue> => {
    const existing = readEntry<TValue>(key);
    const next = updater(existing?.value);
    store.set(key, { value: next, expiresAt: existing?.expiresAt });
    return next;
  };

  const del = async (key: string): Promise<void> => {
    store.delete(key);
  };

  return { get, set, update, delete: del };
};
