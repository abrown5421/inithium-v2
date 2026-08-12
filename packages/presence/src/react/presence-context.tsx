import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { createPubSubClient } from '@inithium/pubsub/client';
import { getApiBaseUrl, selectCurrentUser, selectIsAuthenticated, useAppSelector } from '@inithium/store';
import { createPresenceManager, type PresenceManager } from '../presence-manager.js';
import type { PresenceEventRegistry, PresenceStatus } from '../types.js';

export interface PresenceContextValue {
  readonly getStatus: (userId: string) => PresenceStatus;
  readonly subscribe: (listener: (statuses: ReadonlyMap<string, PresenceStatus>) => void) => () => void;
  readonly setBusy: () => void;
  readonly clearBusy: () => void;
}

const PresenceContext = React.createContext<PresenceContextValue | undefined>(undefined);

const ACTIVITY_EVENT_NAMES = ['mousemove', 'keydown', 'pointerdown', 'wheel', 'touchstart'] as const;

export interface PresenceProviderProps {
  readonly children: React.ReactNode;
}

export const PresenceProvider: React.FC<PresenceProviderProps> = ({ children }) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();
  const [manager, setManager] = React.useState<PresenceManager | undefined>(undefined);

  React.useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      setManager(undefined);
      return undefined;
    }

    const client = createPubSubClient<PresenceEventRegistry>({
      url: getApiBaseUrl(),
      socketIoOptions: { withCredentials: true }
    });

    const nextManager = createPresenceManager({ client, getCurrentUserId: () => currentUser.id });
    nextManager.connect();
    setManager(nextManager);

    return () => {
      nextManager.dispose();
    };
  }, [isAuthenticated, currentUser?.id]);

  React.useEffect(() => {
    if (!manager) return undefined;

    const handleActivity = (): void => manager.recordActivity();
    ACTIVITY_EVENT_NAMES.forEach((eventName) => window.addEventListener(eventName, handleActivity, { passive: true }));
    return () => {
      ACTIVITY_EVENT_NAMES.forEach((eventName) => window.removeEventListener(eventName, handleActivity));
    };
  }, [manager]);

  React.useEffect(() => {
    manager?.recordActivity();
  }, [manager, location.pathname]);

  const value = React.useMemo<PresenceContextValue>(
    () => ({
      getStatus: (userId) => manager?.getStatus(userId) ?? 'offline',
      subscribe: (listener) => manager?.subscribe(listener) ?? (() => undefined),
      setBusy: () => manager?.setBusy(),
      clearBusy: () => manager?.clearBusy()
    }),
    [manager]
  );

  return <PresenceContext.Provider value={value}>{children}</PresenceContext.Provider>;
};

export const usePresenceStatus = (userId: string | undefined): PresenceStatus => {
  const context = React.useContext(PresenceContext);
  const [status, setStatus] = React.useState<PresenceStatus>('offline');

  React.useEffect(() => {
    if (!userId || !context) {
      setStatus('offline');
      return undefined;
    }

    setStatus(context.getStatus(userId));

    return context.subscribe((statuses) => {
      setStatus(statuses.get(userId) ?? 'offline');
    });
  }, [userId, context]);

  return status;
};

export interface PresenceControls {
  readonly setBusy: () => void;
  readonly clearBusy: () => void;
}

export const usePresenceControls = (): PresenceControls => {
  const context = React.useContext(PresenceContext);
  return React.useMemo(
    () => ({
      setBusy: () => context?.setBusy(),
      clearBusy: () => context?.clearBusy()
    }),
    [context]
  );
};
