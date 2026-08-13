import { usePluginPubSubClient, usePluginPubSubEvent } from '@inithium/plugin-engine/client';
import { openAlert, useAppDispatch } from '@inithium/store';
import type { FriendsEventRegistry } from '../friends-events.js';

export const useFriendsNotifications = (onFriendEvent?: () => void): void => {
  const dispatch = useAppDispatch();
  const client = usePluginPubSubClient<FriendsEventRegistry>();

  usePluginPubSubEvent(client, 'FRIEND_REQUEST_SENT', (payload) => {
    dispatch(
      openAlert({
        severity: 'info',
        message: `${payload.fromFirstName} ${payload.fromLastName} sent you a friend request`
      })
    );
    onFriendEvent?.();
  });

  usePluginPubSubEvent(client, 'FRIEND_REQUEST_ACCEPTED', (payload) => {
    dispatch(
      openAlert({
        severity: 'success',
        message: `${payload.byFirstName} ${payload.byLastName} accepted your friend request`
      })
    );
    onFriendEvent?.();
  });
};
