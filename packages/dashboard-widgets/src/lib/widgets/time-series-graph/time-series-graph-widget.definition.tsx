import { LineChart as LineChartIcon } from 'lucide-react';
import type { TimeSeriesGraphWidgetConfig } from '@inithium/models';
import type { WidgetDefinition } from '../../registry/widget-types.js';
import { TimeSeriesGraphWidgetContainer } from './time-series-graph-widget.container.js';
import { TimeSeriesGraphWidgetConfigForm } from './time-series-graph-widget-config-form.js';

const DEFAULT_DATE_RANGE_DAYS = 30;

const buildDefaultDateRange = (): { readonly dateFrom: string; readonly dateTo: string } => {
  const dateTo = new Date();
  const dateFrom = new Date(dateTo);
  dateFrom.setDate(dateFrom.getDate() - DEFAULT_DATE_RANGE_DAYS);
  return { dateFrom: dateFrom.toISOString().slice(0, 10), dateTo: dateTo.toISOString().slice(0, 10) };
};

export const timeSeriesGraphWidgetDefinition: WidgetDefinition<TimeSeriesGraphWidgetConfig> = {
  widgetType: 'time-series-graph',
  displayName: 'Time-Series Graph',
  description: 'Plots document counts over time for a collection.',
  icon: LineChartIcon,
  getTitle: (config) => config.title,
  createDefaultConfig: ({ reportableCollections }) => ({
    title: 'Time-Series Graph',
    targetCollection: reportableCollections[0] ?? '',
    bucket: 'day',
    ...buildDefaultDateRange()
  }),
  renderContainer: ({ config }) => <TimeSeriesGraphWidgetContainer config={config} />,
  renderConfigForm: ({ config, onChange }) => <TimeSeriesGraphWidgetConfigForm config={config} onChange={onChange} />
};
