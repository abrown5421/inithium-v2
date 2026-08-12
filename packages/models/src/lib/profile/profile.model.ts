import { BaseEntity } from '@inithium/types';

export interface Address {
  readonly addressLine1: string;
  readonly addressLine2?: string;
  readonly city: string;
  readonly state: string;
  readonly postalCode: string;
  readonly country: string;
}

export const BANNER_TYPES = ['trianglify', 'image'] as const;

export type BannerType = (typeof BANNER_TYPES)[number];

export interface TrianglifyConfig {
  readonly variance: number;
  readonly cell_size: number;
  readonly x_colors: readonly string[];
  readonly y_colors: readonly string[];
}

export const DEFAULT_TRIANGLIFY_CONFIG: TrianglifyConfig = {
  variance: 0.75,
  cell_size: 40,
  x_colors: ['#0f5066', '#115e7a', '#1e293b'],
  y_colors: ['#1e293b', '#64748b', '#e2e8f0']
};

export interface ProfileBanner {
  readonly bannerType?: BannerType;
  readonly trianglifyConfig?: TrianglifyConfig;
  readonly bannerAssetRef?: string;
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
