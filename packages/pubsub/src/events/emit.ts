import type { EventRegistry, EventName } from '../types/event-registry.js';
import type { DispatchMessage } from '../types/dispatch.js';
import type { Channel } from '../types/channels.js';

export type Dispatch = <TPayload>(message: DispatchMessage<TPayload>) => Promise<void>;

export interface EventEmitters<TEvents extends EventRegistry> {
  readonly toChannel: <K extends EventName<TEvents['serverToClient']>>(
    channel: Channel,
    event: K,
    payload: TEvents['serverToClient'][K]
  ) => Promise<void>;
  readonly multicast: <K extends EventName<TEvents['serverToClient']>>(
    channels: readonly Channel[],
    event: K,
    payload: TEvents['serverToClient'][K]
  ) => Promise<void>;
  readonly broadcast: <K extends EventName<TEvents['serverToClient']>>(
    event: K,
    payload: TEvents['serverToClient'][K]
  ) => Promise<void>;
}

export const createEventEmitters = <TEvents extends EventRegistry>(dispatch: Dispatch): EventEmitters<TEvents> => {
  const toChannel: EventEmitters<TEvents>['toChannel'] = (channel, event, payload) =>
    dispatch({ targets: [channel], event, payload });

  const multicast: EventEmitters<TEvents>['multicast'] = (channels, event, payload) =>
    dispatch({ targets: channels, event, payload });

  const broadcast: EventEmitters<TEvents>['broadcast'] = (event, payload) =>
    dispatch({ targets: 'ALL', event, payload });

  return { toChannel, multicast, broadcast };
};
