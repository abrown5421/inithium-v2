import { z } from 'zod';

/**
 * Persistence-level validation only checks the generic shape — `widgetType` is an open string
 * (core and plugin-contributed types alike), so per-type config validation happens client-side via
 * each `WidgetDefinition.configSchema` instead of a server-side discriminated union.
 */
const widgetLayoutItemSchema = z.object({
  id: z.string().min(1),
  widgetType: z.string().min(1),
  config: z.record(z.string(), z.unknown())
});

export const createUserDashboardConfigSchema = z.object({
  userId: z.string().optional(),
  widgets: z.array(widgetLayoutItemSchema).default([])
});

export const updateUserDashboardConfigSchema = createUserDashboardConfigSchema.partial();

export type CreateUserDashboardConfigDTO = z.infer<typeof createUserDashboardConfigSchema>;
export type UpdateUserDashboardConfigDTO = z.infer<typeof updateUserDashboardConfigSchema>;
