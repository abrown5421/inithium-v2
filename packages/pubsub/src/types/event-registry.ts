export type EventPayloadMap = Record<string, unknown>;

export interface EventRegistry<
  ServerToClientEvents extends EventPayloadMap = EventPayloadMap,
  ClientToServerEvents extends EventPayloadMap = EventPayloadMap,
  InterServerEvents extends EventPayloadMap = EventPayloadMap
> {
  readonly serverToClient: ServerToClientEvents;
  readonly clientToServer: ClientToServerEvents;
  readonly interServer: InterServerEvents;
}

export type EventName<TMap extends EventPayloadMap> = keyof TMap & string;

export type EventPayload<TMap extends EventPayloadMap, TEvent extends EventName<TMap>> = TMap[TEvent];
