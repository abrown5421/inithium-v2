import { Result, err } from 'neverthrow';
import { AppError, createConflictError } from '@inithium/types';
import type { PluginMeta } from '../contracts/plugin-meta.types.js';
import { PluginRegistryState } from './state.js';
import { topologicallySortPlugins } from './topo-sort.js';

/** Namespace -> keys this module occupies (e.g. `{ routerPath: ['/friends'] }`). Used for collision detection. */
export type CollisionKeys = Readonly<Record<string, readonly string[]>>;

export type ExtractCollisionKeys<TModule extends PluginMeta> = (module: TModule) => CollisionKeys;

const findCollision = <TModule extends PluginMeta>(
  existing: Readonly<Record<string, TModule>>,
  incoming: TModule,
  extractKeys: ExtractCollisionKeys<TModule>
): string | undefined => {
  const incomingKeys = extractKeys(incoming);

  for (const existingPlugin of Object.values(existing)) {
    const existingKeys = extractKeys(existingPlugin);
    for (const namespace of Object.keys(incomingKeys)) {
      const overlap = incomingKeys[namespace]?.find((key) => existingKeys[namespace]?.includes(key));
      if (overlap) {
        return `Plugin "${incoming.id}" conflicts with plugin "${existingPlugin.id}": duplicate ${namespace} "${overlap}"`;
      }
    }
  }

  return undefined;
};

/**
 * Registers a batch of plugin modules. Collisions/duplicate ids are checked incrementally, but
 * `dependsOn` is validated once against the *complete* resulting set — so a batch that discovers
 * a dependent before its dependency (an arbitrary directory-scan order) still resolves correctly.
 */
export const registerPlugins = <TModule extends PluginMeta>(
  state: PluginRegistryState<TModule>,
  modules: readonly TModule[],
  extractKeys: ExtractCollisionKeys<TModule>
): Result<PluginRegistryState<TModule>, AppError> => {
  let manifests = state.manifests;

  for (const module of modules) {
    if (manifests[module.id]) {
      return err(createConflictError(`Plugin "${module.id}" is already registered`));
    }

    const collisionMessage = findCollision(manifests, module, extractKeys);
    if (collisionMessage) {
      return err(createConflictError(collisionMessage));
    }

    manifests = { ...manifests, [module.id]: module };
  }

  return topologicallySortPlugins(Object.values(manifests)).map((order) => ({
    manifests,
    order: order.map((plugin) => plugin.id),
    enabledIds: new Set([...state.enabledIds, ...modules.map((module) => module.id)])
  }));
};

/** Registers a single plugin module — equivalent to `registerPlugins(state, [module], extractKeys)`. */
export const registerPlugin = <TModule extends PluginMeta>(
  state: PluginRegistryState<TModule>,
  module: TModule,
  extractKeys: ExtractCollisionKeys<TModule>
): Result<PluginRegistryState<TModule>, AppError> => registerPlugins(state, [module], extractKeys);
