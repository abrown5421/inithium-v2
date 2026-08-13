import * as React from 'react';
import { createPluginRegistry } from '../registry/state.js';
import type { PluginRegistryState } from '../registry/state.js';
import type { PluginClientModule } from '../contracts/plugin-client.types.js';

const EMPTY_CLIENT_REGISTRY = createPluginRegistry<PluginClientModule>();

const PluginClientRegistryContext = React.createContext<PluginRegistryState<PluginClientModule>>(EMPTY_CLIENT_REGISTRY);

export interface PluginClientRegistryProviderProps {
  readonly registry: PluginRegistryState<PluginClientModule>;
  readonly children: React.ReactNode;
}

/** Provides the app-wide client plugin registry — mount once near the app root, above any page/tab/widget consumer. */
export const PluginClientRegistryProvider: React.FC<PluginClientRegistryProviderProps> = ({ registry, children }) => (
  <PluginClientRegistryContext.Provider value={registry}>{children}</PluginClientRegistryContext.Provider>
);

/** Falls back to an empty registry (no plugins) outside a provider — matches "zero plugins installed" behavior. */
export const usePluginClientRegistry = (): PluginRegistryState<PluginClientModule> =>
  React.useContext(PluginClientRegistryContext);
