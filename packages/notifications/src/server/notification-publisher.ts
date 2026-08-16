import type { ResultAsync } from 'neverthrow';
import type { PubSubServer } from '@inithium/pubsub/server';
import type { EventRegistry, AuthenticatedIdentity } from '@inithium/pubsub';
import type { AppError } from '@inithium/types';
import type { Notification } from '@inithium/models';
import type { CreateNotificationInput, NotificationEventRegistry, NotificationPublisher } from '../types.js';

interface NotificationCreator {
  readonly create: (input: CreateNotificationInput) => ResultAsync<Notification, AppError>;
}

/**
 * `pubsubHandle` is intentionally the same untyped shape plugins receive as `PluginServerContext.pubsub`
 * (`PubSubServer<EventRegistry, AuthenticatedIdentity>`) — narrowed here to `NotificationEventRegistry`,
 * mirroring `createPluginPubSubHandle` in `@inithium/plugin-engine`, without depending on that package
 * (which itself depends on this one for the `NotificationPublisher` type).
 */
export const createNotificationPublisher = (
  creator: NotificationCreator,
  pubsubHandle: PubSubServer<EventRegistry, AuthenticatedIdentity>
): NotificationPublisher => {
  const pubsub = pubsubHandle as unknown as PubSubServer<NotificationEventRegistry, AuthenticatedIdentity>;

  return {
    notify: (input) =>
      creator.create(input).map((notification) => {
        void pubsub.unicast(notification.userId, 'notification:created', notification);
        return notification;
      })
  };
};
