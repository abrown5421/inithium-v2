import { z } from 'zod';
import { TIME_SERIES_BUCKETS } from '@inithium/types';

export const timeSeriesQuerySchema = z
  .object({
    collectionName: z.string().min(1),
    bucket: z.enum(TIME_SERIES_BUCKETS),
    dateFrom: z.coerce.date(),
    dateTo: z.coerce.date()
  })
  .refine((value) => value.dateFrom <= value.dateTo, { message: 'dateFrom must be on or before dateTo', path: ['dateTo'] })
  .refine((value) => value.dateTo.getTime() - value.dateFrom.getTime() <= 1000 * 60 * 60 * 24 * 730, {
    message: 'date range cannot exceed 2 years',
    path: ['dateTo']
  });

export type TimeSeriesQueryDTO = z.infer<typeof timeSeriesQuerySchema>;
