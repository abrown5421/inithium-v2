import { ResultAsync } from 'neverthrow';
import { AppError } from '@inithium/types';
import { SettingService } from '@inithium/services';
import { isPluginEnablementList, reconcilePluginEnablementEntries, resolveEnabledPluginIds } from '@inithium/plugin-engine';

export const PLUGINS_ENABLED_SETTING_NAME = 'plugins.enabled';

/**
 * Idempotent: seeds `plugins.enabled` on first boot with one `{ name, enabled: true }` entry per
 * discovered plugin. On every later boot, reconciles the persisted entries against the currently
 * discovered plugins — appending an entry for anything newly installed without touching the enabled
 * flag of anything already there — and only writes back when that reconciliation actually added
 * something. Always resolves to the ids that are currently enabled, the live, admin-editable source
 * of truth for which discovered plugins are actually active.
 */
export const ensureDefaultPluginsEnabled = (
  service: SettingService,
  discoveredIds: readonly string[]
): ResultAsync<readonly string[], AppError> =>
  service.readAll(1, 1, { settingName: PLUGINS_ENABLED_SETTING_NAME }).andThen((result) => {
    const existing = result.data[0];

    if (!existing) {
      const seeded = reconcilePluginEnablementEntries(discoveredIds, undefined);
      return service
        .createOne({ settingName: PLUGINS_ENABLED_SETTING_NAME, settingType: 'array', settingValue: seeded })
        .map(() => resolveEnabledPluginIds(discoveredIds, seeded));
    }

    const reconciled = reconcilePluginEnablementEntries(discoveredIds, existing.settingValue);
    const existingCount = isPluginEnablementList(existing.settingValue) ? existing.settingValue.length : 0;

    if (reconciled.length === existingCount) {
      return ResultAsync.fromSafePromise(Promise.resolve(resolveEnabledPluginIds(discoveredIds, existing.settingValue)));
    }

    return service
      .updateOne(existing._id, { settingValue: reconciled })
      .map(() => resolveEnabledPluginIds(discoveredIds, reconciled));
  });
