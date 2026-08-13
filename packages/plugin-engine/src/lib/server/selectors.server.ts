import { listEnabledPluginsInOrder } from '../registry/state.js';
import type { PluginRegistryState } from '../registry/state.js';
import type { PluginServerModule, PluginServerRouterContribution } from '../contracts/plugin-server.types.js';

export const getServerRouterContributions = (
  state: PluginRegistryState<PluginServerModule>
): readonly PluginServerRouterContribution[] => listEnabledPluginsInOrder(state).flatMap((plugin) => plugin.routers ?? []);

export const getOnUserRegisteredHooks = (
  state: PluginRegistryState<PluginServerModule>
): readonly ((userId: string) => void)[] =>
  listEnabledPluginsInOrder(state).flatMap((plugin) => (plugin.onUserRegistered ? [plugin.onUserRegistered] : []));
