import { BaseEntity, TimeSeriesBucket } from '@inithium/types';

/** Open string, not a closed union — plugins register widget types the core model can't enumerate. */
export type WidgetType = string;

export interface TimeSeriesGraphWidgetConfig {
  readonly title: string;
  readonly targetCollection: string;
  readonly bucket: TimeSeriesBucket;
  readonly dateFrom: string;
  readonly dateTo: string;
}

export interface WidgetLayoutItem {
  readonly id: string;
  readonly widgetType: WidgetType;
  readonly config: Record<string, unknown>;
}

export interface UserDashboardConfig extends BaseEntity {
  readonly userId: string;
  readonly widgets: readonly WidgetLayoutItem[];
}
