import type { WidgetType } from '@inithium/models';
import type { WidgetDefinition } from './widget-types.js';
import { timeSeriesGraphWidgetDefinition } from '../widgets/time-series-graph/time-series-graph-widget.definition.js';

const WIDGET_REGISTRY: Readonly<Record<WidgetType, WidgetDefinition<never>>> = {
  'time-series-graph': timeSeriesGraphWidgetDefinition as unknown as WidgetDefinition<never>
};

export const getWidgetDefinition = (widgetType: WidgetType): WidgetDefinition<never> => WIDGET_REGISTRY[widgetType];

export const listWidgetDefinitions = (): readonly WidgetDefinition<never>[] => Object.values(WIDGET_REGISTRY);
