import type { Setting } from '@inithium/models';

export const PROFILE_CONFIG_SETTING_NAME = 'site.profileConfig';

export interface PaginatedSettings {
  readonly data?: readonly Setting[];
}

export const extractSettingsMap = (response?: PaginatedSettings): Record<string, unknown> =>
  (response?.data ?? []).reduce<Record<string, unknown>>(
    (acc, item) => ({ ...acc, [item.settingName]: item.settingValue }),
    {}
  );

export const isProfileFieldActive = (config: unknown, field: string): boolean => {
  if (typeof config !== 'object' || config === null) return true;
  return (config as Record<string, unknown>)[field] !== false;
};
