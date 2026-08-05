import { z } from 'zod';
import { assetCategorySchema } from '../schemas/assets.js';

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

export const settingValueTypeSchema = z.enum(['string', 'number', 'boolean', 'color', 'asset', 'array', 'object']);

const settingTypeMatchesValueShape = (settingType: z.infer<typeof settingValueTypeSchema>, settingValue: unknown): boolean => {
  switch (settingType) {
    case 'string':
    case 'color':
    case 'asset':
      return typeof settingValue === 'string';
    case 'number':
      return typeof settingValue === 'number';
    case 'boolean':
      return typeof settingValue === 'boolean';
    case 'array':
      return Array.isArray(settingValue);
    case 'object':
      return typeof settingValue === 'object' && settingValue !== null && !Array.isArray(settingValue) && !(settingValue instanceof Date);
  }
};

const baseSettingObjectSchema = z.object({
  settingName: z.string().min(1),
  settingType: settingValueTypeSchema.optional(),
  settingSubType: z.string().optional(),
  settingValue: settingValueSchema
});

/**
 * Cross-field consistency, applied to both create and update: `settingType`, when present, must
 * describe the shape `settingValue` actually has (so the two can never silently drift apart), and
 * `settingSubType` — currently only meaningful for `settingType: 'asset'` (an asset category) — is
 * rejected outright on any other type and must be a real asset category when it does apply. Both
 * fields stay entirely optional so pre-existing settings created before this schema change keep
 * validating with neither present.
 */
const refineSettingConsistency = (
  data: { readonly settingType?: z.infer<typeof settingValueTypeSchema>; readonly settingSubType?: string; readonly settingValue?: unknown },
  ctx: z.RefinementCtx
): void => {
  if (data.settingType !== undefined && data.settingValue !== undefined && !settingTypeMatchesValueShape(data.settingType, data.settingValue)) {
    ctx.addIssue({ code: 'custom', path: ['settingValue'], message: `settingValue does not match settingType "${data.settingType}"` });
  }

  if (data.settingSubType !== undefined) {
    if (data.settingType !== 'asset') {
      ctx.addIssue({ code: 'custom', path: ['settingSubType'], message: 'settingSubType is only valid when settingType is "asset"' });
    } else if (!assetCategorySchema.safeParse(data.settingSubType).success) {
      ctx.addIssue({ code: 'custom', path: ['settingSubType'], message: 'settingSubType must be a valid asset category' });
    }
  }
};

export const createSettingSchema = baseSettingObjectSchema.superRefine(refineSettingConsistency);
export const updateSettingSchema = baseSettingObjectSchema.partial().superRefine(refineSettingConsistency);

export type CreateSettingDTO = z.infer<typeof createSettingSchema>;
export type UpdateSettingDTO = z.infer<typeof updateSettingSchema>;
