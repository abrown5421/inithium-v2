import { BaseEntity, TimeSeriesBucket } from '@inithium/types';

export const WIDGET_TYPES = ['time-series-graph'] as const;

export type WidgetType = (typeof WIDGET_TYPES)[number];

export interface TimeSeriesGraphWidgetConfig {
  readonly title: string;
  readonly targetCollection: string;
  readonly bucket: TimeSeriesBucket;
  readonly dateFrom: string;
  readonly dateTo: string;
}

export interface WidgetConfigByType {
  readonly 'time-series-graph': TimeSeriesGraphWidgetConfig;
}

export type WidgetLayoutItem = {
  readonly [K in WidgetType]: { readonly id: string; readonly widgetType: K; readonly config: WidgetConfigByType[K] };
}[WidgetType];

export interface UserDashboardConfig extends BaseEntity {
  readonly userId: string;
  readonly widgets: readonly WidgetLayoutItem[];
}
