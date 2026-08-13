import { useGetTimeSeriesQuery } from '@inithium/store';
import type { TimeSeriesGraphWidgetConfig } from '@inithium/models';
import { TimeSeriesGraphWidget } from './time-series-graph-widget.js';

export interface TimeSeriesGraphWidgetContainerProps {
  readonly config: TimeSeriesGraphWidgetConfig;
}

export const TimeSeriesGraphWidgetContainer = ({ config }: TimeSeriesGraphWidgetContainerProps) => {
  const { data, isLoading, error } = useGetTimeSeriesQuery({
    collectionName: config.targetCollection,
    bucket: config.bucket,
    dateFrom: config.dateFrom,
    dateTo: config.dateTo
  });

  return (
    <TimeSeriesGraphWidget points={data?.points ?? []} bucket={config.bucket} isLoading={isLoading} errorMessage={error?.message} />
  );
};
