import { ResultAsync } from 'neverthrow';
import { AppError } from '@inithium/types';
import { SettingService } from '@inithium/services';
import { PRIMARY_SYSTEM_LOGO_KEY } from '../assets/ensure-default-system-logo.js';

export const SITE_LOGO_SETTING_NAME = 'site.logo';

/** Domain-independent asset proxy path — matches what `AssetPicker`/`resolveAssetUrl` expect to find in `settingValue`. */
export const DEFAULT_SITE_LOGO_VALUE = `/assets/by-key/${PRIMARY_SYSTEM_LOGO_KEY}`;

/** Idempotent: only creates the `site.logo` setting if one doesn't already exist. */
export const ensureDefaultSiteLogo = (service: SettingService): ResultAsync<string, AppError> =>
  service.readAll(1, 1, { settingName: SITE_LOGO_SETTING_NAME }).andThen((result) => {
    if (result.total > 0) {
      return ResultAsync.fromSafePromise(Promise.resolve(`${SITE_LOGO_SETTING_NAME} already exists, skipping seed`));
    }
    return service
      .createOne({
        settingName: SITE_LOGO_SETTING_NAME,
        settingType: 'asset',
        settingSubType: 'images',
        settingValue: DEFAULT_SITE_LOGO_VALUE,
      })
      .map(() => `${SITE_LOGO_SETTING_NAME} seeded`);
  });
