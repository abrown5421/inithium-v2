export interface PluginEnablementEntry {
  readonly name: string;
  readonly enabled: boolean;
}

const isPluginEnablementEntry = (value: unknown): value is PluginEnablementEntry =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as Record<string, unknown>)['name'] === 'string' &&
  typeof (value as Record<string, unknown>)['enabled'] === 'boolean';

export const isPluginEnablementList = (value: unknown): value is readonly PluginEnablementEntry[] =>
  Array.isArray(value) && value.every(isPluginEnablementEntry);

/**
 * Resolves which discovered plugin ids are active from the `plugins.enabled` Setting doc's value —
 * an array of `{ name, enabled }` entries, one per discovered plugin. Falls back to enabling every
 * discovered plugin if the setting hasn't been seeded yet (or holds something unrecognized).
 */
export const resolveEnabledPluginIds = (discoveredIds: readonly string[], settingValue: unknown): readonly string[] => {
  if (isPluginEnablementList(settingValue)) {
    return settingValue.filter((entry) => entry.enabled).map((entry) => entry.name);
  }
  return discoveredIds;
};

/**
 * Reconciles persisted `{ name, enabled }` entries against currently-discovered plugin ids: existing
 * entries (and their enabled flags) are left untouched, and a default-enabled entry is appended for
 * any discovered id not yet present — so newly-installed plugins show up automatically without
 * disturbing an admin's prior choices for plugins already in the list.
 */
export const reconcilePluginEnablementEntries = (
  discoveredIds: readonly string[],
  settingValue: unknown
): readonly PluginEnablementEntry[] => {
  const existing = isPluginEnablementList(settingValue) ? settingValue : [];
  const existingNames = new Set(existing.map((entry) => entry.name));
  const additions = discoveredIds.filter((id) => !existingNames.has(id)).map((id) => ({ name: id, enabled: true }));
  return [...existing, ...additions];
};
