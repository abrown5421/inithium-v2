import { Response, Router } from 'express';
import { AppError } from '@inithium/types';
import type {} from '@inithium/auth';
import type { PluginServerContext } from '@inithium/plugin-engine/server';
import { createPluginPubSubHandle } from '@inithium/plugin-engine/server';
import { createFriendshipService } from './friendship.service.js';
import { friendsNotificationChannel, type FriendsEventRegistry } from './friends-events.js';
import type { SearchableUserField } from './friendship.model.js';

const DEFAULT_PAGE_LIMIT = 20;
const SEARCHABLE_FIELDS = new Set<SearchableUserField>(['firstName', 'lastName', 'email']);

const parsePage = (value: unknown): number => {
  const parsed = typeof value === 'string' ? Number.parseInt(value, 10) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const parseLimit = (value: unknown): number => {
  const parsed = typeof value === 'string' ? Number.parseInt(value, 10) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_PAGE_LIMIT;
};

const parseSearch = (value: unknown): string | undefined => (typeof value === 'string' && value.trim() ? value.trim() : undefined);

const parseField = (value: unknown): SearchableUserField =>
  typeof value === 'string' && SEARCHABLE_FIELDS.has(value as SearchableUserField) ? (value as SearchableUserField) : 'firstName';

const sendError = (res: Response, error: AppError): void => {
  const status =
    error.type === 'NOT_FOUND_ERROR'
      ? 404
      : error.type === 'CONFLICT_ERROR'
        ? 409
        : error.type === 'FORBIDDEN_ERROR'
          ? 403
          : error.type === 'UNAUTHORIZED_ERROR'
            ? 401
            : error.type === 'VALIDATION_ERROR'
              ? 400
              : 500;
  res.status(status).json({ success: false, error });
};

export const createFriendsRouter = (ctx: PluginServerContext): Router => {
  const router = Router();
  const friendshipService = createFriendshipService(ctx.db, {
    onFriendRequestSent: (notification) => {
      const pubsub = createPluginPubSubHandle<FriendsEventRegistry>(ctx.pubsub);
      void pubsub.toChannel(friendsNotificationChannel(notification.recipientId), 'FRIEND_REQUEST_SENT', {
        friendshipId: notification.friendshipId,
        fromUserId: notification.fromUserId,
        fromFirstName: notification.fromFirstName,
        fromLastName: notification.fromLastName
      });
    },
    onFriendRequestAccepted: (notification) => {
      const pubsub = createPluginPubSubHandle<FriendsEventRegistry>(ctx.pubsub);
      void pubsub.toChannel(friendsNotificationChannel(notification.requesterId), 'FRIEND_REQUEST_ACCEPTED', {
        friendshipId: notification.friendshipId,
        byUserId: notification.byUserId,
        byFirstName: notification.byFirstName,
        byLastName: notification.byLastName
      });
    }
  });

  router.use(ctx.authenticate);

  router.get('/users/search', (req, res) => {
    const currentUserId = req.user!.id;
    const field = parseField(req.query['field']);
    const search = parseSearch(req.query['search']) ?? '';
    const page = parsePage(req.query['page']);
    const limit = parseLimit(req.query['limit']);

    void friendshipService.searchUsers(currentUserId, field, search, page, limit).match(
      (data) => res.status(200).json({ success: true, data }),
      (error) => sendError(res, error)
    );
  });

  router.get('/pending', (req, res) => {
    const currentUserId = req.user!.id;
    const page = parsePage(req.query['page']);
    const limit = parseLimit(req.query['limit']);
    const field = parseField(req.query['field']);
    const search = parseSearch(req.query['search']);

    void friendshipService.getPendingRequests(currentUserId, page, limit, field, search).match(
      (data) => res.status(200).json({ success: true, data }),
      (error) => sendError(res, error)
    );
  });

  router.get('/of/:userId', (req, res) => {
    const page = parsePage(req.query['page']);
    const limit = parseLimit(req.query['limit']);
    const field = parseField(req.query['field']);
    const search = parseSearch(req.query['search']);

    void friendshipService.getFriendsForUser(req.params.userId, page, limit, field, search).match(
      (data) => res.status(200).json({ success: true, data }),
      (error) => sendError(res, error)
    );
  });

  router.get('/of/:userId/mutual', (req, res) => {
    const currentUserId = req.user!.id;
    const page = parsePage(req.query['page']);
    const limit = parseLimit(req.query['limit']);
    const field = parseField(req.query['field']);
    const search = parseSearch(req.query['search']);

    void friendshipService.getMutualFriends(currentUserId, req.params.userId, page, limit, field, search).match(
      (data) => res.status(200).json({ success: true, data }),
      (error) => sendError(res, error)
    );
  });

  router.post('/requests', (req, res) => {
    const currentUserId = req.user!.id;
    const recipientId = typeof req.body?.recipientId === 'string' ? req.body.recipientId : undefined;

    if (!recipientId) {
      res.status(400).json({ success: false, error: { type: 'VALIDATION_ERROR', message: 'recipientId is required' } });
      return;
    }

    void friendshipService.sendFriendRequest(currentUserId, recipientId).match(
      (data) => res.status(201).json({ success: true, data }),
      (error) => sendError(res, error)
    );
  });

  router.post('/requests/:friendshipId/accept', (req, res) => {
    const currentUserId = req.user!.id;

    void friendshipService.acceptFriendRequest(req.params.friendshipId, currentUserId).match(
      (data) => res.status(200).json({ success: true, data }),
      (error) => sendError(res, error)
    );
  });

  router.delete('/requests/:friendshipId', (req, res) => {
    const currentUserId = req.user!.id;

    void friendshipService.declineFriendRequest(req.params.friendshipId, currentUserId).match(
      () => res.status(204).send(),
      (error) => sendError(res, error)
    );
  });

  router.delete('/:friendshipId', (req, res) => {
    const currentUserId = req.user!.id;

    void friendshipService.removeFriend(req.params.friendshipId, currentUserId).match(
      () => res.status(204).send(),
      (error) => sendError(res, error)
    );
  });

  return router;
};
