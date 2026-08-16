import { z } from 'zod';

/**
 * Never exposed as a public request body — notifications are only ever created in-process via
 * `NotificationPublisher.notify()` (core code or a plugin's `PluginServerContext.notifications`),
 * never through an HTTP `POST`. This schema exists purely to validate that call site's payload.
 */
export const createNotificationSchema = z.object({
  userId: z.string().min(1),
  type: z.string().min(1),
  sourcePluginId: z.string().min(1).default('core'),
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(2000),
  link: z.string().max(500).optional()
});

export type CreateNotificationDTO = z.infer<typeof createNotificationSchema>;

export const notificationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25)
});

export type NotificationQueryDTO = z.infer<typeof notificationQuerySchema>;
