import type { Redis } from 'ioredis';
import type { StateStore, StateUpdater } from './state.interface.js';

const COMPARE_AND_SWAP_SCRIPT = `
local current = redis.call('GET', KEYS[1])
local expectedExists = ARGV[1] == '1'
local expected = ARGV[2]
local nextValue = ARGV[3]
local ttlSeconds = ARGV[4]
local matches = false

if expectedExists then
  matches = current == expected
else
  matches = current == false
end

if not matches then
  return 0
end

if ttlSeconds == '' then
  redis.call('SET', KEYS[1], nextValue)
else
  redis.call('SET', KEYS[1], nextValue, 'EX', ttlSeconds)
end

return 1
`;

export interface RedisStateStoreOptions {
  readonly client: Redis;
  readonly keyPrefix?: string;
  readonly maxUpdateRetries?: number;
}

export const createRedisStateStore = (options: RedisStateStoreOptions): StateStore => {
  const { client, keyPrefix = 'state', maxUpdateRetries = 16 } = options;

  const namespacedKey = (key: string): string => `${keyPrefix}:${key}`;

  const get = async <TValue>(key: string): Promise<TValue | undefined> => {
    const raw = await client.get(namespacedKey(key));
    return raw === null ? undefined : (JSON.parse(raw) as TValue);
  };

  const set = async <TValue>(key: string, value: TValue, ttlSeconds?: number): Promise<void> => {
    const serialized = JSON.stringify(value);
    const fullKey = namespacedKey(key);

    if (ttlSeconds === undefined) {
      await client.set(fullKey, serialized);
    } else {
      await client.set(fullKey, serialized, 'EX', ttlSeconds);
    }
  };

  const update = async <TValue>(key: string, updater: StateUpdater<TValue>): Promise<TValue> => {
    const fullKey = namespacedKey(key);

    for (let attempt = 0; attempt < maxUpdateRetries; attempt += 1) {
      const raw = await client.get(fullKey);
      const current = raw === null ? undefined : (JSON.parse(raw) as TValue);
      const next = updater(current);
      const ttl = raw === null ? -1 : await client.ttl(fullKey);

      const applied = await client.eval(
        COMPARE_AND_SWAP_SCRIPT,
        1,
        fullKey,
        raw === null ? '0' : '1',
        raw ?? '',
        JSON.stringify(next),
        ttl > 0 ? String(ttl) : ''
      );

      if (applied === 1) {
        return next;
      }
    }

    throw new Error(`Unable to atomically update state for key "${key}" after ${maxUpdateRetries} attempts`);
  };

  const del = async (key: string): Promise<void> => {
    await client.del(namespacedKey(key));
  };

  return { get, set, update, delete: del };
};
