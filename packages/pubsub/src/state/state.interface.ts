export type StateUpdater<TValue> = (current: TValue | undefined) => TValue;

export interface StateStore {
  readonly get: <TValue>(key: string) => Promise<TValue | undefined>;
  readonly set: <TValue>(key: string, value: TValue, ttlSeconds?: number) => Promise<void>;
  readonly update: <TValue>(key: string, updater: StateUpdater<TValue>) => Promise<TValue>;
  readonly delete: (key: string) => Promise<void>;
}
