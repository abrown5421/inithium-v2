import {
  selectCurrentUser,
  useAppSelector,
  useGetMyNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationReadMutation
} from '@inithium/store';
import type { Notification } from '@inithium/models';

export interface NotificationCenterState {
  readonly notifications: readonly Notification[];
  readonly unreadCount: number;
  readonly isLoading: boolean;
  readonly markAsRead: (id: string) => void;
}

export const useNotificationCenter = (): NotificationCenterState => {
  const currentUser = useAppSelector(selectCurrentUser);
  const skip = !currentUser?.id;

  const { data: notificationsResult, isLoading: isLoadingNotifications } = useGetMyNotificationsQuery({ limit: 50 }, { skip });
  const { data: unreadCountResult, isLoading: isLoadingUnreadCount } = useGetUnreadNotificationCountQuery(undefined, { skip });
  const [markNotificationRead] = useMarkNotificationReadMutation();

  return {
    notifications: notificationsResult?.data ?? [],
    unreadCount: unreadCountResult?.count ?? 0,
    isLoading: isLoadingNotifications || isLoadingUnreadCount,
    markAsRead: (id) => {
      void markNotificationRead(id);
    }
  };
};
