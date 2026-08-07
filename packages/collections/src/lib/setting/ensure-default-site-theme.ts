import { ResultAsync } from 'neverthrow';
import { AppError } from '@inithium/types';
import { SettingService } from '@inithium/services';

export const SITE_THEME_SETTING_NAME = 'site.theme';

export const DEFAULT_SITE_THEME_VALUE = {
  primary: 'oklch(0.49 0.09 224.7)',
  secondary: 'oklch(0.72 0.03 198.5)',
  accent: 'oklch(0.78 0.16 57.8)',
  muted: 'oklch(0.97 0 0)',
  success: 'oklch(0.6 0.16 149)',
  warning: 'oklch(0.77 0.16 75)',
  info: 'oklch(0.6 0.16 250)',
  destructive: 'oklch(0.577 0.245 27.325)',
} as const;

/** Idempotent: only creates the `site.theme` setting if one doesn't already exist. */
export const ensureDefaultSiteTheme = (service: SettingService): ResultAsync<string, AppError> =>
  service.readAll(1, 1, { settingName: SITE_THEME_SETTING_NAME }).andThen((result) => {
    if (result.total > 0) {
      return ResultAsync.fromSafePromise(Promise.resolve(`${SITE_THEME_SETTING_NAME} already exists, skipping seed`));
    }
    return service
      .createOne({
        settingName: SITE_THEME_SETTING_NAME,
        settingType: 'object',
        settingValue: DEFAULT_SITE_THEME_VALUE,
      })
      .map(() => `${SITE_THEME_SETTING_NAME} seeded`);
  });
