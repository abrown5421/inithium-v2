import { io as createSocketIOConnection, type ManagerOptions, type Socket, type SocketOptions } from 'socket.io-client';
import type { EventRegistry, EventName } from '../types/event-registry.js';
import type { Unsubscribe } from '../types/common.js';

export type ConnectionState = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

export type AuthPayload = Record<string, unknown>;

export interface CreatePubSubClientOptions {
  readonly url: string;
  readonly auth?: AuthPayload | (() => AuthPayload | Promise<AuthPayload>);
  readonly socketIoOptions?: Partial<ManagerOptions & SocketOptions>;
}

export interface PubSubClient<TEvents extends EventRegistry> {
  readonly connect: () => void;
  readonly disconnect: () => void;
  readonly emit: <K extends EventName<TEvents['clientToServer']>>(
    event: K,
    payload: TEvents['clientToServer'][K]
  ) => void;
  readonly on: <K extends EventName<TEvents['serverToClient']>>(
    event: K,
    handler: (payload: TEvents['serverToClient'][K]) => void
  ) => Unsubscribe;
  readonly onStateChange: (handler: (state: ConnectionState) => void) => Unsubscribe;
  readonly getState: () => ConnectionState;
}

type UntypedEventTarget = {
  readonly on: (event: string, handler: (...args: any[]) => void) => unknown;
  readonly off: (event: string, handler: (...args: any[]) => void) => unknown;
};

type ResolvedAuthOption = AuthPayload | ((callback: (data: AuthPayload) => void) => void);

const resolveAuthOption = (auth: CreatePubSubClientOptions['auth']): ResolvedAuthOption | undefined => {
  if (auth === undefined || typeof auth !== 'function') {
    return auth;
  }

  return (callback) => {
    void Promise.resolve(auth()).then(callback);
  };
};

export const createPubSubClient = <TEvents extends EventRegistry>(
  options: CreatePubSubClientOptions
): PubSubClient<TEvents> => {
  const socket: Socket = createSocketIOConnection(options.url, {
    ...options.socketIoOptions,
    autoConnect: false,
    auth: resolveAuthOption(options.auth)
  });

  let state: ConnectionState = 'idle';
  const stateHandlers = new Set<(state: ConnectionState) => void>();

  const setState = (next: ConnectionState): void => {
    state = next;
    stateHandlers.forEach((handler) => handler(next));
  };

  socket.on('connect', () => setState('connected'));
  socket.on('disconnect', () => setState('disconnected'));
  socket.io.on('reconnect_attempt', () => setState('reconnecting'));

  const connect = (): void => {
    setState('connecting');
    socket.connect();
  };

  const disconnect = (): void => {
    socket.disconnect();
  };

  const emit: PubSubClient<TEvents>['emit'] = (event, payload) => {
    socket.emit(event, payload);
  };

  const untypedSocket = socket as unknown as UntypedEventTarget;

  const on: PubSubClient<TEvents>['on'] = (event, handler) => {
    untypedSocket.on(event, handler);
    return () => {
      untypedSocket.off(event, handler);
    };
  };

  const onStateChange: PubSubClient<TEvents>['onStateChange'] = (handler) => {
    stateHandlers.add(handler);
    return () => {
      stateHandlers.delete(handler);
    };
  };

  const getState = (): ConnectionState => state;

  return { connect, disconnect, emit, on, onStateChange, getState };
};
