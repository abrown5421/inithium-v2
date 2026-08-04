import { z } from 'zod';

export const createSettingSchema = z.object({
  settingName: z.string(),
});

export const updateSettingSchema = createSettingSchema.partial();

export type CreateSettingDTO = z.infer<typeof createSettingSchema>;
export type UpdateSettingDTO = z.infer<typeof updateSettingSchema>;
