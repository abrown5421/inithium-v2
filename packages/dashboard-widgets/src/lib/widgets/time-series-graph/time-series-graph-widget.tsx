import { Skeleton, Text } from '@inithium/ui';
import type { TimeSeriesBucket, TimeSeriesPoint } from '@inithium/types';
import { TimeSeriesChart } from './time-series-chart.js';

export interface TimeSeriesGraphWidgetProps {
  readonly points: readonly TimeSeriesPoint[];
  readonly bucket: TimeSeriesBucket;
  readonly isLoading: boolean;
  readonly errorMessage?: string;
}

export const TimeSeriesGraphWidget = ({ points, bucket, isLoading, errorMessage }: TimeSeriesGraphWidgetProps) => {
  if (isLoading) {
    return <Skeleton className="h-full min-h-40 w-full" />;
  }

  if (errorMessage) {
    return (
      <div className="flex h-full min-h-40 items-center justify-center text-center">
        <Text size="sm" color="destructive">
          {errorMessage}
        </Text>
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div className="flex h-full min-h-40 items-center justify-center text-center">
        <Text size="sm">No data in this range</Text>
      </div>
    );
  }

  return <TimeSeriesChart points={points} bucket={bucket} />;
};
