import { z } from 'zod';
import { BANNER_TYPES } from '@inithium/models';

const E164_PHONE_PATTERN = /^\+[1-9]\d{1,14}$/;

const addressSchema = z.object({
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1)
});

const HEX_COLOR_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const trianglifyConfigSchema = z.object({
  variance: z.number().min(0).max(1),
  cell_size: z.number().positive(),
  x_colors: z.array(z.string().regex(HEX_COLOR_PATTERN)).min(1),
  y_colors: z.array(z.string().regex(HEX_COLOR_PATTERN)).min(1)
});

const profileBannerSchema = z.object({
  bannerType: z.enum(BANNER_TYPES).optional(),
  trianglifyConfig: trianglifyConfigSchema.optional(),
  bannerAssetRef: z.string().optional()
});

const profileGenderSchema = z.discriminatedUnion('type', [
  z.object({ type: z.enum(['Male', 'Female', 'Prefer Not to Say']) }),
  z.object({ type: z.literal('Other'), custom: z.string().min(1) })
]);

export const createProfileSchema = z.object({
  user_id: z.string().optional(),
  profileAvatar: z.string().optional(),
  profileBanner: profileBannerSchema.optional(),
  profileBio: z.string().optional(),
  profileDOB: z.coerce.date().optional(),
  profileGender: profileGenderSchema.optional(),
  profilePhone: z.string().regex(E164_PHONE_PATTERN).optional(),
  profileAccessControl: z.boolean().optional(),
  profileShippingAddress: addressSchema.optional(),
  profileBillingAddress: addressSchema.optional(),
  profileOtherSocials: z.array(z.string().url()).optional()
});

export const updateProfileSchema = createProfileSchema.partial();

export type CreateProfileDTO = z.infer<typeof createProfileSchema>;
export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;
