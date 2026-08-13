import { z } from 'zod';
import { TIME_SERIES_BUCKETS } from '@inithium/types';

const timeSeriesGraphWidgetConfigSchema = z
  .object({
    title: z.string().min(1).max(120),
    targetCollection: z.string().min(1),
    bucket: z.enum(TIME_SERIES_BUCKETS),
    dateFrom: z.string().date(),
    dateTo: z.string().date()
  })
  .refine((value) => value.dateFrom <= value.dateTo, { message: 'dateFrom must be on or before dateTo', path: ['dateTo'] });

const timeSeriesGraphWidgetItemSchema = z.object({
  id: z.string().min(1),
  widgetType: z.literal('time-series-graph'),
  config: timeSeriesGraphWidgetConfigSchema
});

const widgetLayoutItemSchema = z.discriminatedUnion('widgetType', [timeSeriesGraphWidgetItemSchema]);

export const createUserDashboardConfigSchema = z.object({
  userId: z.string().optional(),
  widgets: z.array(widgetLayoutItemSchema).default([])
});

export const updateUserDashboardConfigSchema = createUserDashboardConfigSchema.partial();

export type CreateUserDashboardConfigDTO = z.infer<typeof createUserDashboardConfigSchema>;
export type UpdateUserDashboardConfigDTO = z.infer<typeof updateUserDashboardConfigSchema>;
