import { BaseEntity } from '@inithium/types';

export type SettingPrimitive = string | number | boolean | null;

export type SettingValue =
  | SettingPrimitive
  | Date
  | readonly SettingValue[]
  | { readonly [key: string]: SettingValue };

export const SETTING_VALUE_TYPES = ['string', 'number', 'boolean', 'color', 'asset', 'array', 'object'] as const;

export type SettingValueType = (typeof SETTING_VALUE_TYPES)[number];

export interface Setting extends BaseEntity {
  readonly settingName: string;
  /**
   * Which of the CMS editor's shapes `settingValue` represents. Optional so settings created
   * before this field existed keep working unmigrated — the CMS falls back to inferring a shape
   * from `settingValue` itself when this is absent.
   */
  readonly settingType?: SettingValueType;
  /**
   * Further constrains `settingType` — currently only meaningful when `settingType` is `'asset'`
   * (an asset category, e.g. `'fonts'`), locking which kind of asset the field accepts so it can't
   * be silently swapped for the wrong kind (a font selected where an image was expected, etc.).
   * Optional and type-specific: most settings need no sub-type at all.
   */
  readonly settingSubType?: string;
  readonly settingValue: SettingValue;
}
