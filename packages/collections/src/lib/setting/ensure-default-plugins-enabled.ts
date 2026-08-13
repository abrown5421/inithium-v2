import { ResultAsync } from 'neverthrow';
import { AppError } from '@inithium/types';
import { SettingService } from '@inithium/services';
import { resolveEnabledPluginIds } from '@inithium/plugin-engine';

export const PLUGINS_ENABLED_SETTING_NAME = 'plugins.enabled';

/**
 * Idempotent: seeds `plugins.enabled` (defaulting to every discovered plugin) only if it doesn't
 * already exist, then always resolves to the setting's current value — the live, admin-editable
 * source of truth for which discovered plugins are actually enabled.
 */
export const ensureDefaultPluginsEnabled = (
  service: SettingService,
  discoveredIds: readonly string[]
): ResultAsync<readonly string[], AppError> =>
  service.readAll(1, 1, { settingName: PLUGINS_ENABLED_SETTING_NAME }).andThen((result) => {
    const existing = result.data[0];
    if (existing) {
      return ResultAsync.fromSafePromise(Promise.resolve(resolveEnabledPluginIds(discoveredIds, existing.settingValue)));
    }

    return service
      .createOne({ settingName: PLUGINS_ENABLED_SETTING_NAME, settingType: 'array', settingValue: discoveredIds })
      .map(() => discoveredIds);
  });
