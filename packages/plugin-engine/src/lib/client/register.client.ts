import type { Result } from 'neverthrow';
import type { AppError } from '@inithium/types';
import { registerPlugin, registerPlugins, ExtractCollisionKeys } from '../registry/register.js';
import type { PluginRegistryState } from '../registry/state.js';
import type { PluginClientModule } from '../contracts/plugin-client.types.js';

const extractClientCollisionKeys: ExtractCollisionKeys<PluginClientModule> = (module) => ({
  pageLayout: Object.keys(module.pageLayouts ?? {}),
  widget: Object.keys(module.widgets ?? {}),
  profileTab: (module.profileTabs ?? []).map((tab) => tab.id)
});

export const registerClientPlugin = (
  state: PluginRegistryState<PluginClientModule>,
  module: PluginClientModule
): Result<PluginRegistryState<PluginClientModule>, AppError> => registerPlugin(state, module, extractClientCollisionKeys);

export const registerClientPlugins = (
  state: PluginRegistryState<PluginClientModule>,
  modules: readonly PluginClientModule[]
): Result<PluginRegistryState<PluginClientModule>, AppError> => registerPlugins(state, modules, extractClientCollisionKeys);
