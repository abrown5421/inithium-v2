import type { ComponentType } from 'react';
import type { PageLayoutRegistry } from '@inithium/pages';
import { listEnabledPluginsInOrder } from '../registry/state.js';
import type { PluginRegistryState } from '../registry/state.js';
import type { PluginClientModule, ProfileTabDefinition, WidgetDefinition } from '../contracts/plugin-client.types.js';

export const getPageLayoutContributions = (state: PluginRegistryState<PluginClientModule>): PageLayoutRegistry =>
  listEnabledPluginsInOrder(state).reduce<Record<string, PageLayoutRegistry[string]>>(
    (acc, plugin) => ({ ...acc, ...(plugin.pageLayouts ?? {}) }),
    {}
  );

export const getProfileTabContributions = (
  state: PluginRegistryState<PluginClientModule>
): readonly ProfileTabDefinition[] => listEnabledPluginsInOrder(state).flatMap((plugin) => plugin.profileTabs ?? []);

export const getWidgetDefinitionContributions = (
  state: PluginRegistryState<PluginClientModule>
): Readonly<Record<string, WidgetDefinition<never>>> =>
  listEnabledPluginsInOrder(state).reduce<Record<string, WidgetDefinition<never>>>(
    (acc, plugin) => ({ ...acc, ...(plugin.widgets ?? {}) }),
    {}
  );

export const getBackgroundComponentContributions = (
  state: PluginRegistryState<PluginClientModule>
): readonly ComponentType[] => listEnabledPluginsInOrder(state).flatMap((plugin) => plugin.backgroundComponents ?? []);
