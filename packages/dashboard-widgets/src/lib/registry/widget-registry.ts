import {
  usePluginClientRegistry,
  getWidgetDefinitionContributions,
  mergeRegistryMaps
} from '@inithium/plugin-engine/client';
import type { WidgetType } from '@inithium/models';
import type { WidgetDefinition } from './widget-types.js';
import { timeSeriesGraphWidgetDefinition } from '../widgets/time-series-graph/time-series-graph-widget.definition.js';

const CORE_WIDGET_REGISTRY: Readonly<Record<string, WidgetDefinition<never>>> = {
  'time-series-graph': timeSeriesGraphWidgetDefinition as unknown as WidgetDefinition<never>
};

/** Core widgets merged with whatever the currently-enabled plugins contribute. */
export const useWidgetRegistry = (): Readonly<Record<string, WidgetDefinition<never>>> => {
  const pluginRegistry = usePluginClientRegistry();
  return mergeRegistryMaps(CORE_WIDGET_REGISTRY, getWidgetDefinitionContributions(pluginRegistry));
};

export const useWidgetDefinition = (widgetType: WidgetType): WidgetDefinition<never> | undefined =>
  useWidgetRegistry()[widgetType];

export const useWidgetDefinitionList = (): readonly WidgetDefinition<never>[] => Object.values(useWidgetRegistry());
