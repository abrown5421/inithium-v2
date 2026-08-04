import { z } from 'zod';

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;

const isoDateStringSchema = z
  .string()
  .regex(ISO_DATE_PATTERN)
  .transform((value) => new Date(value));

const settingPrimitiveSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

export const settingValueSchema: z.ZodType<unknown> = z.lazy(() =>
  z.union([
    z.date(),
    isoDateStringSchema,
    settingPrimitiveSchema,
    z.array(settingValueSchema),
    z.record(z.string(), settingValueSchema)
  ])
);

export const createSettingSchema = z.object({
  settingName: z.string().min(1),
  settingValue: settingValueSchema
});

export const updateSettingSchema = createSettingSchema.partial();

export type CreateSettingDTO = z.infer<typeof createSettingSchema>;
export type UpdateSettingDTO = z.infer<typeof updateSettingSchema>;
