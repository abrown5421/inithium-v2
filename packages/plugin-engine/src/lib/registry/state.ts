import type { PluginMeta } from '../contracts/plugin-meta.types.js';

export interface PluginRegistryState<TModule extends PluginMeta> {
  readonly manifests: Readonly<Record<string, TModule>>;
  readonly order: readonly string[];
  readonly enabledIds: ReadonlySet<string>;
}

export const createPluginRegistry = <TModule extends PluginMeta>(): PluginRegistryState<TModule> => ({
  manifests: {},
  order: [],
  enabledIds: new Set<string>()
});

/** Replaces the enabled subset wholesale — the runtime projection of the `plugins.enabled` Setting doc. */
export const setEnabledPluginIds = <TModule extends PluginMeta>(
  state: PluginRegistryState<TModule>,
  enabledIds: readonly string[]
): PluginRegistryState<TModule> => ({ ...state, enabledIds: new Set(enabledIds) });

export const listEnabledPluginsInOrder = <TModule extends PluginMeta>(
  state: PluginRegistryState<TModule>
): readonly TModule[] =>
  state.order
    .filter((id) => state.enabledIds.has(id))
    .map((id) => state.manifests[id])
    .filter((module): module is TModule => Boolean(module));
