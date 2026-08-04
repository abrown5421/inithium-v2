import { BaseEntity } from '@inithium/types';

export type SettingPrimitive = string | number | boolean | null;

export type SettingValue =
  | SettingPrimitive
  | Date
  | readonly SettingValue[]
  | { readonly [key: string]: SettingValue };

export interface Setting extends BaseEntity {
  readonly settingName: string;
  readonly settingValue: SettingValue;
}
