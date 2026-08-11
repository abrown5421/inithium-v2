import { BaseEntity } from '@inithium/types';

export interface Address {
  readonly addressLine1: string;
  readonly addressLine2?: string;
  readonly city: string;
  readonly state: string;
  readonly postalCode: string;
  readonly country: string;
}

export interface ProfileBanner {
  readonly assetUrl?: string;
  readonly trianglifyConfig?: Record<string, unknown>;
}

export type Gender =
  | { readonly type: 'Male' | 'Female' | 'Prefer Not to Say'; readonly custom?: never }
  | { readonly type: 'Other'; readonly custom: string };

export interface Profile extends BaseEntity {
  readonly user_id?: string;
  readonly profileAvatar?: string;
  readonly profileBanner?: ProfileBanner;
  readonly profileBio?: string;
  readonly profileDOB?: Date;
  readonly profileGender?: Gender;
  readonly profilePhone?: string;
  readonly profileAccessControl?: boolean;
  readonly profileShippingAddress?: Address;
  readonly profileBillingAddress?: Address;
  readonly profileOtherSocials?: readonly string[];
}
