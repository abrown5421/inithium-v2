# pubsub

Real-time messaging and transient state engine for Inithium, built on Socket.io. Provides authenticated gateways, cross-node pub/sub scaling, and a distributed state store for room- and game-oriented applications.

## Entry points

- `@inithium/pubsub` — environment-agnostic contracts: event registries, channel helpers, `BrokerAdapter`/`StateStore` interfaces, and the `unicast`/`multicast`/`broadcast` emit helpers.
- `@inithium/pubsub/server` — `createPubSubServer`, the `InMemoryAdapter`/`RedisAdapter` brokers, and the `MemoryStateStore`/`RedisStateStore` drivers.
- `@inithium/pubsub/client` — `createPubSubClient`, a typed wrapper around `socket.io-client` for browser or Node consumers.

## Building

Run `nx build pubsub` to build the library.
