import { EventEmitter } from 'node:events';
import type { BrokerAdapter, BrokerMessageHandler, BrokerUnsubscribe } from './broker.interface.js';

export const createInMemoryBrokerAdapter = (): BrokerAdapter => {
  const emitter = new EventEmitter();
  emitter.setMaxListeners(0);

  const publish = async <TPayload>(channel: string, payload: TPayload): Promise<void> => {
    emitter.emit(channel, payload);
  };

  const subscribe = async <TPayload>(
    channel: string,
    handler: BrokerMessageHandler<TPayload>
  ): Promise<BrokerUnsubscribe> => {
    const listener = (payload: TPayload): void => handler(payload);
    emitter.on(channel, listener);

    return async () => {
      emitter.off(channel, listener);
    };
  };

  const close = async (): Promise<void> => {
    emitter.removeAllListeners();
  };

  return { publish, subscribe, close };
};
