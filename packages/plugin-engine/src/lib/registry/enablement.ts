/**
 * Resolves which discovered plugin ids are active. Priority: the `plugins.enabled` Setting doc's
 * value (once seeded) is authoritative; an env var is only a first-boot seed default (server-only —
 * pass `undefined` on the client); if neither is present, every discovered plugin is enabled.
 */
export const resolveEnabledPluginIds = (
  discoveredIds: readonly string[],
  settingValue: unknown,
  envFallback?: string
): readonly string[] => {
  if (Array.isArray(settingValue) && settingValue.every((id) => typeof id === 'string')) {
    return settingValue as readonly string[];
  }

  if (envFallback) {
    return envFallback
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id.length > 0);
  }

  return discoveredIds;
};
