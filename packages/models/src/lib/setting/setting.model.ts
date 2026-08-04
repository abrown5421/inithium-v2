import { BaseEntity } from '@inithium/types';

export interface Setting extends BaseEntity {
  readonly settingName: string;
}
