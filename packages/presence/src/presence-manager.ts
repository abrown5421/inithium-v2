import type { PubSubClient } from '@inithium/pubsub/client';
import { createInactivityTracker } from './inactivity-tracker.js';
import {
  applyPresenceChanged,
  applyPresenceSnapshot,
  clearBusyOverride,
  createInitialPresenceState,
  deriveOwnStatus,
  recordActivity as applyActivity,
  setBusyOverride,
  type PresenceState
} from './presence-state.js';
import { PRESENCE_INACTIVITY_THRESHOLD_MS, type PresenceEventRegistry, type PresenceStatus } from './types.js';

export type PresenceListener = (statuses: ReadonlyMap<string, PresenceStatus>) => void;
export type PresenceUnsubscribe = () => void;

export interface PresenceManagerOptions {
  readonly client: PubSubClient<PresenceEventRegistry>;
  readonly getCurrentUserId: () => string | null;
  readonly inactivityThresholdMs?: number;
}

export interface PresenceManager {
  readonly connect: () => void;
  readonly disconnect: () => void;
  readonly recordActivity: () => void;
  readonly setBusy: () => void;
  readonly clearBusy: () => void;
  readonly getStatus: (userId: string) => PresenceStatus;
  readonly subscribe: (listener: PresenceListener) => PresenceUnsubscribe;
  readonly dispose: () => void;
}

export const createPresenceManager = (options: PresenceManagerOptions): PresenceManager => {
  const thresholdMs = options.inactivityThresholdMs ?? PRESENCE_INACTIVITY_THRESHOLD_MS;
  const listeners = new Set<PresenceListener>();

  let state: PresenceState = createInitialPresenceState(Date.now());
  let unsubscribeChanged: PresenceUnsubscribe | undefined;
  let unsubscribeSnapshot: PresenceUnsubscribe | undefined;

  const notify = (): void => {
    listeners.forEach((listener) => listener(state.statuses));
  };

  const reconcileOwnStatus = (): void => {
    const userId = options.getCurrentUserId();
    if (!userId) return;

    const nextStatus = deriveOwnStatus(state, Date.now(), thresholdMs);
    if (state.statuses.get(userId) === nextStatus) return;

    state = applyPresenceChanged(state, { userId, status: nextStatus, at: Date.now() });
    notify();
    options.client.emit('presence:update', { status: nextStatus });
  };

  const inactivityTracker = createInactivityTracker({ thresholdMs, onIdle: reconcileOwnStatus });

  const connect = (): void => {
    unsubscribeChanged = options.client.on('presence:changed', (payload) => {
      state = applyPresenceChanged(state, payload);
      notify();
    });
    unsubscribeSnapshot = options.client.on('presence:snapshot', (payload) => {
      state = applyPresenceSnapshot(state, payload);
      notify();
    });
    options.client.connect();
    options.client.emit('presence:request-snapshot', {});
    reconcileOwnStatus();
  };

  const disconnect = (): void => {
    unsubscribeChanged?.();
    unsubscribeSnapshot?.();
    unsubscribeChanged = undefined;
    unsubscribeSnapshot = undefined;
    options.client.disconnect();
  };

  const recordActivityEffect = (): void => {
    state = applyActivity(state, Date.now());
    inactivityTracker.recordActivity();
    reconcileOwnStatus();
  };

  const setBusy = (): void => {
    state = setBusyOverride(state);
    reconcileOwnStatus();
  };

  const clearBusy = (): void => {
    state = clearBusyOverride(state);
    reconcileOwnStatus();
  };

  const getStatus = (userId: string): PresenceStatus => state.statuses.get(userId) ?? 'offline';

  const subscribe = (listener: PresenceListener): PresenceUnsubscribe => {
    listeners.add(listener);
    listener(state.statuses);
    return () => {
      listeners.delete(listener);
    };
  };

  const dispose = (): void => {
    inactivityTracker.dispose();
    disconnect();
    listeners.clear();
  };

  return {
    connect,
    disconnect,
    recordActivity: recordActivityEffect,
    setBusy,
    clearBusy,
    getStatus,
    subscribe,
    dispose
  };
};
