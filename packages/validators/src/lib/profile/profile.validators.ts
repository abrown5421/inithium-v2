import { z } from 'zod';

const E164_PHONE_PATTERN = /^\+[1-9]\d{1,14}$/;

const addressSchema = z.object({
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1)
});

const profileBannerSchema = z.object({
  assetUrl: z.string().url().optional(),
  trianglifyConfig: z.record(z.string(), z.unknown()).optional()
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
