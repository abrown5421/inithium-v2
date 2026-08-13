import type { PubSubServer } from '@inithium/pubsub/server';
import type { EventRegistry, AuthenticatedIdentity } from '@inithium/pubsub';
import type { PluginPubSubHandle } from '../contracts/plugin-server.types.js';

/**
 * Narrows the untyped `PluginServerContext.pubsub` handle to a plugin's own `EventRegistry<...>`,
 * without widening (or even touching) core's own server/client event interfaces.
 */
export const createPluginPubSubHandle = <TEvents extends EventRegistry>(
  server: PluginPubSubHandle
): PubSubServer<TEvents, AuthenticatedIdentity> => server as unknown as PubSubServer<TEvents, AuthenticatedIdentity>;

/**
 * The other direction of the same boundary cast: narrows core's own concrete pub/sub server down
 * to the untyped handle exposed on `PluginServerContext`. Used once, at plugin-context construction.
 */
export const toPluginPubSubHandle = <TEvents extends EventRegistry, TIdentity extends AuthenticatedIdentity>(
  server: PubSubServer<TEvents, TIdentity>
): PluginPubSubHandle => server as unknown as PluginPubSubHandle;
