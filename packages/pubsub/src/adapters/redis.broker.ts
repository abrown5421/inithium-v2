import { Redis, type RedisOptions } from 'ioredis';
import type { BrokerAdapter, BrokerMessageHandler, BrokerUnsubscribe } from './broker.interface.js';

export type RedisBrokerAdapterOptions =
  | { readonly publisher: Redis; readonly subscriber: Redis; readonly channelPrefix?: string }
  | { readonly connection: RedisOptions | string; readonly channelPrefix?: string };

const resolveClients = (options: RedisBrokerAdapterOptions): { publisher: Redis; subscriber: Redis } => {
  if ('publisher' in options) {
    return { publisher: options.publisher, subscriber: options.subscriber };
  }

  const publisher = typeof options.connection === 'string' ? new Redis(options.connection) : new Redis(options.connection);
  return { publisher, subscriber: publisher.duplicate() };
};

export const createRedisBrokerAdapter = (options: RedisBrokerAdapterOptions): BrokerAdapter => {
  const { publisher, subscriber } = resolveClients(options);
  const channelPrefix = options.channelPrefix ?? 'pubsub';
  const handlersByChannel = new Map<string, Set<BrokerMessageHandler<unknown>>>();

  const namespacedChannel = (channel: string): string => `${channelPrefix}:${channel}`;

  subscriber.on('message', (rawChannel: string, rawPayload: string) => {
    const handlers = handlersByChannel.get(rawChannel);
    if (!handlers || handlers.size === 0) return;

    const payload = JSON.parse(rawPayload) as unknown;
    handlers.forEach((handler) => handler(payload));
  });

  const publish = async <TPayload>(channel: string, payload: TPayload): Promise<void> => {
    await publisher.publish(namespacedChannel(channel), JSON.stringify(payload));
  };

  const subscribe = async <TPayload>(
    channel: string,
    handler: BrokerMessageHandler<TPayload>
  ): Promise<BrokerUnsubscribe> => {
    const fullChannel = namespacedChannel(channel);
    const typedHandler = handler as BrokerMessageHandler<unknown>;
    const existing = handlersByChannel.get(fullChannel);

    if (existing) {
      existing.add(typedHandler);
    } else {
      handlersByChannel.set(fullChannel, new Set([typedHandler]));
      await subscriber.subscribe(fullChannel);
    }

    return async () => {
      const handlers = handlersByChannel.get(fullChannel);
      if (!handlers) return;

      handlers.delete(typedHandler);

      if (handlers.size === 0) {
        handlersByChannel.delete(fullChannel);
        await subscriber.unsubscribe(fullChannel);
      }
    };
  };

  const close = async (): Promise<void> => {
    handlersByChannel.clear();
    await Promise.all([publisher.quit(), subscriber.quit()]);
  };

  return { publish, subscribe, close };
};
