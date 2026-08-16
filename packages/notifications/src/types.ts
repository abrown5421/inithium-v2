import type { ResultAsync } from 'neverthrow';
import type { EventPayloadMap, EventRegistry } from '@inithium/pubsub';
import type { AppError } from '@inithium/types';
import type { Notification } from '@inithium/models';

export interface CreateNotificationInput {
  readonly userId: string;
  readonly type: string;
  /** 'core' for core-originated notifications, else the id of the plugin that created it. */
  readonly sourcePluginId: string;
  readonly title: string;
  readonly message: string;
  readonly link?: string;
}

/** Handed to plugins via `PluginServerContext.notifications` and used by core the same way. */
export interface NotificationPublisher {
  readonly notify: (input: CreateNotificationInput) => ResultAsync<Notification, AppError>;
}

export interface NotificationServerToClientEvents extends EventPayloadMap {
  readonly 'notification:created': Notification;
}

export type NotificationEventRegistry = EventRegistry<NotificationServerToClientEvents, EventPayloadMap, EventPayloadMap>;
