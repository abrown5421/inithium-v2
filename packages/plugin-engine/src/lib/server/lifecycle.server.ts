import { ResultAsync, okAsync } from 'neverthrow';
import type { AppError } from '@inithium/types';
import { listEnabledPluginsInOrder } from '../registry/state.js';
import type { PluginRegistryState } from '../registry/state.js';
import type { PluginServerContext, PluginServerModule, PluginTeardown } from '../contracts/plugin-server.types.js';

/**
 * Runs each enabled plugin's `onServerInit` in topological order, short-circuiting on the first
 * failure. Collects any returned teardown closures keyed by plugin id.
 */
export const initServerHooks = (
  state: PluginRegistryState<PluginServerModule>,
  ctx: PluginServerContext
): ResultAsync<Readonly<Record<string, PluginTeardown>>, AppError> =>
  listEnabledPluginsInOrder(state).reduce<ResultAsync<Record<string, PluginTeardown>, AppError>>(
    (acc, plugin) =>
      acc.andThen((teardowns) => {
        const hookResult = plugin.onServerInit?.(ctx) ?? okAsync(undefined);
        return hookResult.map((teardown) => (teardown ? { ...teardowns, [plugin.id]: teardown } : teardowns));
      }),
    okAsync({})
  );
