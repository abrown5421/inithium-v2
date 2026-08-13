import * as React from 'react';
import { createPubSubClient, type PubSubClient } from '@inithium/pubsub/client';
import type { EventRegistry, EventName } from '@inithium/pubsub';
import { getApiBaseUrl, selectIsAuthenticated, useAppSelector } from '@inithium/store';

/**
 * Opens a plugin's own cookie-authenticated Socket.io connection, mirroring the server-side
 * `createPluginPubSubHandle<TEvents>()` ergonomics for the browser. A second connection separate
 * from `@inithium/presence`'s (no connection-sharing yet) — acceptable v1 tradeoff, not a defect.
 */
export const usePluginPubSubClient = <TEvents extends EventRegistry>(): PubSubClient<TEvents> | undefined => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [client, setClient] = React.useState<PubSubClient<TEvents>>();

  React.useEffect(() => {
    if (!isAuthenticated) {
      setClient(undefined);
      return undefined;
    }

    const nextClient = createPubSubClient<TEvents>({
      url: getApiBaseUrl(),
      socketIoOptions: { withCredentials: true }
    });
    nextClient.connect();
    setClient(nextClient);

    return () => {
      nextClient.disconnect();
    };
  }, [isAuthenticated]);

  return client;
};

export const usePluginPubSubEvent = <TEvents extends EventRegistry, K extends EventName<TEvents['serverToClient']>>(
  client: PubSubClient<TEvents> | undefined,
  event: K,
  handler: (payload: TEvents['serverToClient'][K]) => void
): void => {
  const handlerRef = React.useRef(handler);
  handlerRef.current = handler;

  React.useEffect(() => {
    if (!client) return undefined;
    return client.on(event, (payload) => handlerRef.current(payload));
  }, [client, event]);
};
