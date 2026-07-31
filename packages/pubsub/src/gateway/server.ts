import type { Server as HttpServer } from 'node:http';
import { Server as SocketIOServer, type ServerOptions, type Socket } from 'socket.io';
import type { BrokerAdapter } from '../adapters/broker.interface.js';
import { createInMemoryBrokerAdapter } from '../adapters/in-memory.broker.js';
import type { StateStore } from '../state/state.interface.js';
import { createInMemoryStateStore } from '../state/in-memory.state.js';
import type { AuthMiddleware, AuthenticatedIdentity } from '../types/identity.js';
import type { EventRegistry, EventName } from '../types/event-registry.js';
import type { Channel } from '../types/channels.js';
import { userChannel } from '../types/channels.js';
import type { DispatchMessage } from '../types/dispatch.js';
import { createEventEmitters } from '../events/emit.js';
import { createConnectionAuthenticator } from './middleware.js';

const DISPATCH_CHANNEL = '__pubsub__:dispatch';

type UntypedEventTarget = {
  readonly on: (event: string, handler: (...args: any[]) => void) => unknown;
};

export interface ConnectedClient<TEvents extends EventRegistry, TIdentity extends AuthenticatedIdentity> {
  readonly id: string;
  readonly identity: TIdentity;
  readonly join: (channel: Channel) => Promise<void>;
  readonly leave: (channel: Channel) => Promise<void>;
  readonly emit: <K extends EventName<TEvents['serverToClient']>>(
    event: K,
    payload: TEvents['serverToClient'][K]
  ) => void;
  readonly on: <K extends EventName<TEvents['clientToServer']>>(
    event: K,
    handler: (payload: TEvents['clientToServer'][K]) => void
  ) => void;
  readonly disconnect: (shouldCloseConnection?: boolean) => void;
}

export interface PubSubServer<TEvents extends EventRegistry, TIdentity extends AuthenticatedIdentity> {
  readonly unicast: <K extends EventName<TEvents['serverToClient']>>(
    userId: string,
    event: K,
    payload: TEvents['serverToClient'][K]
  ) => Promise<void>;
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
  readonly onConnect: (handler: (client: ConnectedClient<TEvents, TIdentity>) => void) => Unsubscribe;
  readonly onDisconnect: (
    handler: (client: ConnectedClient<TEvents, TIdentity>, reason: string) => void
  ) => Unsubscribe;
  readonly state: StateStore;
  readonly close: () => Promise<void>;
}

type Unsubscribe = () => void;

export interface CreatePubSubServerOptions<TEvents extends EventRegistry, TIdentity extends AuthenticatedIdentity> {
  readonly httpServer: HttpServer;
  readonly authenticate: AuthMiddleware<TIdentity>;
  readonly broker?: BrokerAdapter;
  readonly state?: StateStore;
  readonly socketIoOptions?: Partial<ServerOptions>;
}

export const createPubSubServer = <
  TEvents extends EventRegistry,
  TIdentity extends AuthenticatedIdentity = AuthenticatedIdentity
>(
  options: CreatePubSubServerOptions<TEvents, TIdentity>
): PubSubServer<TEvents, TIdentity> => {
  const broker = options.broker ?? createInMemoryBrokerAdapter();
  const state = options.state ?? createInMemoryStateStore();
  const io = new SocketIOServer(options.httpServer, options.socketIoOptions);

  const connectHandlers = new Set<(client: ConnectedClient<TEvents, TIdentity>) => void>();
  const disconnectHandlers = new Set<(client: ConnectedClient<TEvents, TIdentity>, reason: string) => void>();

  io.use(createConnectionAuthenticator<TIdentity>(options.authenticate));

  const toConnectedClient = (socket: Socket): ConnectedClient<TEvents, TIdentity> => {
    const identity = socket.data.identity as TIdentity;

    return {
      id: socket.id,
      identity,
      join: async (channel) => {
        await socket.join(channel);
      },
      leave: async (channel) => {
        await socket.leave(channel);
      },
      emit: (event, payload) => {
        socket.emit(event, payload);
      },
      on: (event, handler) => {
        (socket as unknown as UntypedEventTarget).on(event, handler);
      },
      disconnect: (shouldCloseConnection = false) => {
        socket.disconnect(shouldCloseConnection);
      }
    };
  };

  io.on('connection', (socket) => {
    const client = toConnectedClient(socket);
    void socket.join(userChannel(client.identity.userId));
    connectHandlers.forEach((handler) => handler(client));

    socket.on('disconnect', (reason) => {
      disconnectHandlers.forEach((handler) => handler(client, reason));
    });
  });

  void broker.subscribe<DispatchMessage>(DISPATCH_CHANNEL, (message) => {
    if (message.targets === 'ALL') {
      io.emit(message.event, message.payload);
    } else {
      io.to([...message.targets]).emit(message.event, message.payload);
    }
  });

  const dispatch = <TPayload>(message: DispatchMessage<TPayload>): Promise<void> =>
    broker.publish(DISPATCH_CHANNEL, message);

  const emitters = createEventEmitters<TEvents>(dispatch);

  return {
    unicast: (userId, event, payload) => emitters.toChannel(userChannel(userId), event, payload),
    toChannel: emitters.toChannel,
    multicast: emitters.multicast,
    broadcast: emitters.broadcast,
    onConnect: (handler) => {
      connectHandlers.add(handler);
      return () => connectHandlers.delete(handler);
    },
    onDisconnect: (handler) => {
      disconnectHandlers.add(handler);
      return () => disconnectHandlers.delete(handler);
    },
    state,
    close: async () => {
      connectHandlers.clear();
      disconnectHandlers.clear();
      await broker.close();
      await new Promise<void>((resolve, reject) => {
        io.close((error) => (error ? reject(error) : resolve()));
      });
    }
  };
};
