import { pluginChannel, type EventPayloadMap, type EventRegistry } from '@inithium/pubsub';

export interface FriendRequestSentPayload {
  readonly friendshipId: string;
  readonly fromUserId: string;
  readonly fromFirstName: string;
  readonly fromLastName: string;
}

export interface FriendRequestAcceptedPayload {
  readonly friendshipId: string;
  readonly byUserId: string;
  readonly byFirstName: string;
  readonly byLastName: string;
}

export interface FriendsServerToClientEvents extends EventPayloadMap {
  readonly FRIEND_REQUEST_SENT: FriendRequestSentPayload;
  readonly FRIEND_REQUEST_ACCEPTED: FriendRequestAcceptedPayload;
}

export type FriendsEventRegistry = EventRegistry<FriendsServerToClientEvents, EventPayloadMap, EventPayloadMap>;

export const friendsNotificationChannel = (userId: string): string =>
  `${pluginChannel('friends', 'notifications')}:${userId}`;
