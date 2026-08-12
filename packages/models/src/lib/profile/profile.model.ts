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

export const AVATAR_TYPES = ['custom', 'image'] as const;

export type AvatarType = (typeof AVATAR_TYPES)[number];

export const AVATAR_FONTS = ['primary', 'secondary', 'sans', 'serif', 'mono'] as const;

export type AvatarFont = (typeof AVATAR_FONTS)[number];

export const AVATAR_SHAPES = ['round', 'square'] as const;

export type AvatarShape = (typeof AVATAR_SHAPES)[number];

export interface CustomAvatarConfig {
  readonly backgroundColor: string;
  readonly fontColor: string;
  readonly font: AvatarFont;
  readonly shape: AvatarShape;
}

export const DEFAULT_CUSTOM_AVATAR_CONFIG: CustomAvatarConfig = {
  backgroundColor: '#0f5066',
  fontColor: '#ffffff',
  font: 'primary',
  shape: 'round'
};

export interface ProfileAvatar {
  readonly avatarType?: AvatarType;
  readonly customAvatarConfig?: CustomAvatarConfig;
  readonly avatarAssetRef?: string;
}

export type Gender =
  | { readonly type: 'Male' | 'Female' | 'Prefer Not to Say'; readonly custom?: never }
  | { readonly type: 'Other'; readonly custom: string };

export interface Profile extends BaseEntity {
  readonly user_id?: string;
  readonly profileAvatar?: ProfileAvatar;
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
