import { Result, err } from 'neverthrow';
import { AppError, createConflictError } from '@inithium/types';
import { registerPlugins, ExtractCollisionKeys } from '../registry/register.js';
import type { PluginRegistryState } from '../registry/state.js';
import type { PluginServerModule } from '../contracts/plugin-server.types.js';

const extractServerCollisionKeys: ExtractCollisionKeys<PluginServerModule> = (module) => ({
  routerPath: (module.routers ?? []).map((router) => router.path)
});

const findReservedPathCollision = (
  module: PluginServerModule,
  reservedPathPrefixes: readonly string[]
): string | undefined =>
  (module.routers ?? [])
    .map((router) => router.path)
    .find((path) =>
      reservedPathPrefixes.some(
        (reserved) => path === reserved || path.startsWith(`${reserved}/`) || reserved.startsWith(`${path}/`)
      )
    );

/**
 * Registers a batch of server plugin modules. `dependsOn` is validated against the complete
 * batch at once (see `registerPlugins`), so arbitrary discovery order doesn't spuriously fail.
 */
export const registerServerPlugins = (
  state: PluginRegistryState<PluginServerModule>,
  modules: readonly PluginServerModule[],
  reservedPathPrefixes: readonly string[] = []
): Result<PluginRegistryState<PluginServerModule>, AppError> => {
  for (const module of modules) {
    const reservedCollision = findReservedPathCollision(module, reservedPathPrefixes);
    if (reservedCollision) {
      return err(
        createConflictError(`Plugin "${module.id}" router path "${reservedCollision}" collides with a reserved core path`)
      );
    }
  }

  return registerPlugins(state, modules, extractServerCollisionKeys);
};

/** Registers a single server plugin module — equivalent to `registerServerPlugins(state, [module], ...)`. */
export const registerServerPlugin = (
  state: PluginRegistryState<PluginServerModule>,
  module: PluginServerModule,
  reservedPathPrefixes: readonly string[] = []
): Result<PluginRegistryState<PluginServerModule>, AppError> => registerServerPlugins(state, [module], reservedPathPrefixes);
