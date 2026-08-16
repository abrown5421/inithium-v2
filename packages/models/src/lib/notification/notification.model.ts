import { BaseEntity } from '@inithium/types';

/** Open string, not a closed union — plugins mint their own namespaced types (e.g. 'friends:friend_request'). */
export type NotificationType = string;

export interface Notification extends BaseEntity {
  readonly userId: string;
  readonly type: NotificationType;
  /** 'core' for core-originated notifications, else the id of the plugin that created it. */
  readonly sourcePluginId: string;
  readonly title: string;
  readonly message: string;
  /** Relative path the client navigates to when the notification is clicked. */
  readonly link?: string;
  readonly read: boolean;
  readonly readAt?: Date;
}
