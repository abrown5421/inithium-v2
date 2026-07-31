export type BrokerMessageHandler<TPayload = unknown> = (payload: TPayload) => void;

export type BrokerUnsubscribe = () => Promise<void>;

export interface BrokerAdapter {
  readonly publish: <TPayload>(channel: string, payload: TPayload) => Promise<void>;
  readonly subscribe: <TPayload>(
    channel: string,
    handler: BrokerMessageHandler<TPayload>
  ) => Promise<BrokerUnsubscribe>;
  readonly close: () => Promise<void>;
}
