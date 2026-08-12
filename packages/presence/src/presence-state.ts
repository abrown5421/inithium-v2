import type { PresenceChangedPayload, PresenceOverride, PresenceSnapshotPayload, PresenceStatus } from './types.js';

export interface PresenceState {
  readonly statuses: ReadonlyMap<string, PresenceStatus>;
  readonly override: PresenceOverride;
  readonly lastActivityAt: number;
}

export const createInitialPresenceState = (now: number): PresenceState => ({
  statuses: new Map(),
  override: null,
  lastActivityAt: now
});

export const applyPresenceChanged = (state: PresenceState, payload: PresenceChangedPayload): PresenceState => {
  const statuses = new Map(state.statuses);
  statuses.set(payload.userId, payload.status);
  return { ...state, statuses };
};

export const applyPresenceSnapshot = (state: PresenceState, payload: PresenceSnapshotPayload): PresenceState => {
  const statuses = new Map(state.statuses);
  payload.entries.forEach((entry) => statuses.set(entry.userId, entry.status));
  return { ...state, statuses };
};

export const recordActivity = (state: PresenceState, now: number): PresenceState => ({ ...state, lastActivityAt: now });

export const setBusyOverride = (state: PresenceState): PresenceState => ({ ...state, override: 'busy' });

export const clearBusyOverride = (state: PresenceState): PresenceState => ({ ...state, override: null });

export const deriveOwnStatus = (
  state: PresenceState,
  now: number,
  inactivityThresholdMs: number
): Exclude<PresenceStatus, 'offline'> => {
  if (state.override === 'busy') return 'busy';
  return now - state.lastActivityAt >= inactivityThresholdMs ? 'away' : 'online';
};
