import { Router, Request, Response, RequestHandler } from 'express';
import { err } from 'neverthrow';
import { handleResult } from '@inithium/crud-engine';
import { createValidationError } from '@inithium/types';
import { notificationQuerySchema } from '@inithium/validators';
import { NotificationService } from '@inithium/services';

export interface NotificationRouterConfig {
  readonly authenticate: RequestHandler;
}

/**
 * No `POST`/`PUT`/`DELETE` here — notifications are only ever created in-process via
 * `NotificationPublisher.notify()`, never over HTTP, so a user can never forge a notification
 * on someone else's behalf. Only read/mark-read routes, both scoped to the caller's own records.
 */
export const createNotificationRouter = (service: NotificationService, config: NotificationRouterConfig): Router => {
  const router = Router();

  router.get('/mine', config.authenticate, async (req: Request, res: Response) => {
    const parsed = notificationQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      handleResult(res, err(createValidationError('Invalid notification query parameters', parsed.error.issues)));
      return;
    }
    const result = await service.listMine(req.user!.id, parsed.data);
    handleResult(res, result);
  });

  router.get('/unread-count', config.authenticate, async (req: Request, res: Response) => {
    const result = await service.countUnread(req.user!.id);
    handleResult(res, result);
  });

  router.patch('/:id/read', config.authenticate, async (req: Request, res: Response) => {
    const id = String(req.params['id']);
    const result = await service.markRead(id, req.user!.id);
    handleResult(res, result);
  });

  return router;
};
