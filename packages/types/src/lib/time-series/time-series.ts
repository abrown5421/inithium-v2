export const TIME_SERIES_BUCKETS = ['day', 'week', 'month'] as const;

export type TimeSeriesBucket = (typeof TIME_SERIES_BUCKETS)[number];

export interface TimeSeriesPoint {
  readonly bucketStart: string;
  readonly count: number;
}

export interface TimeSeriesResult {
  readonly collectionName: string;
  readonly bucket: TimeSeriesBucket;
  readonly dateFrom: string;
  readonly dateTo: string;
  readonly points: readonly TimeSeriesPoint[];
}

export interface TimeSeriesQueryParams {
  readonly collectionName: string;
  readonly bucket: TimeSeriesBucket;
  readonly dateFrom: string;
  readonly dateTo: string;
}
