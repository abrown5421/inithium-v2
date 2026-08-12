import type { EventPayloadMap, EventRegistry } from '@inithium/pubsub';

export type PresenceStatus = 'online' | 'away' | 'busy' | 'offline';

export type PresenceOverride = Extract<PresenceStatus, 'busy'> | null;

export interface PresenceStatusMeta {
  readonly label: string;
  readonly dotClassName: string;
}

export const PRESENCE_STATUS_META: Readonly<Record<PresenceStatus, PresenceStatusMeta>> = {
  online: { label: 'Online', dotClassName: 'bg-success' },
  away: { label: 'Away', dotClassName: 'bg-warning' },
  busy: { label: 'Busy', dotClassName: 'bg-destructive' },
  offline: { label: 'Offline', dotClassName: 'bg-slate-300' }
};

export const PRESENCE_INACTIVITY_THRESHOLD_MS = 10 * 60 * 1000;

export interface PresenceChangedPayload {
  readonly userId: string;
  readonly status: PresenceStatus;
  readonly at: number;
}

export interface PresenceSnapshotPayload {
  readonly entries: readonly PresenceChangedPayload[];
}

export interface PresenceUpdatePayload {
  readonly status: Exclude<PresenceStatus, 'offline'>;
}

export interface PresenceServerToClientEvents extends EventPayloadMap {
  readonly 'presence:changed': PresenceChangedPayload;
  readonly 'presence:snapshot': PresenceSnapshotPayload;
}

export interface PresenceClientToServerEvents extends EventPayloadMap {
  readonly 'presence:update': PresenceUpdatePayload;
  readonly 'presence:request-snapshot': Record<string, never>;
}

export type PresenceEventRegistry = EventRegistry<PresenceServerToClientEvents, PresenceClientToServerEvents, EventPayloadMap>;
