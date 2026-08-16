import * as React from 'react';
import { createPubSubClient } from '@inithium/pubsub/client';
import { getApiBaseUrl, notificationApi, selectCurrentUser, selectIsAuthenticated, useAppDispatch, useAppSelector } from '@inithium/store';
import type { NotificationEventRegistry } from '../types.js';

export interface NotificationsProviderProps {
  readonly children: React.ReactNode;
}

/**
 * Mirrors `PresenceProvider`'s connection lifecycle (own socket, opened on auth, disposed on
 * logout) but exposes nothing via context — the only effect of a live `notification:created`
 * event is invalidating the RTK Query cache so `useGetMyNotificationsQuery`/
 * `useGetUnreadNotificationCountQuery` refetch, which is all `useNotificationCenter` needs.
 */
export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (!isAuthenticated || !currentUser) return undefined;

    const client = createPubSubClient<NotificationEventRegistry>({
      url: getApiBaseUrl(),
      socketIoOptions: { withCredentials: true }
    });

    const unsubscribe = client.on('notification:created', () => {
      dispatch(
        notificationApi.util.invalidateTags([
          { type: 'Notification', id: 'LIST' },
          { type: 'Notification', id: 'UNREAD_COUNT' }
        ])
      );
    });

    client.connect();

    return () => {
      unsubscribe();
      client.disconnect();
    };
  }, [isAuthenticated, currentUser?.id, dispatch]);

  return <>{children}</>;
};
