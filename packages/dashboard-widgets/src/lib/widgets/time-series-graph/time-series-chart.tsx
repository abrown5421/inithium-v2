import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, type TooltipContentProps } from 'recharts';
import { CHART_SERIES_COLOR_VARS } from '@inithium/ui';
import type { TimeSeriesBucket, TimeSeriesPoint } from '@inithium/types';

const BUCKET_DATE_FORMAT_OPTIONS: Record<TimeSeriesBucket, Intl.DateTimeFormatOptions> = {
  day: { month: 'short', day: 'numeric' },
  week: { month: 'short', day: 'numeric' },
  month: { month: 'short', year: 'numeric' }
};

const formatBucketLabel = (bucketStart: string, bucket: TimeSeriesBucket): string =>
  new Intl.DateTimeFormat(undefined, BUCKET_DATE_FORMAT_OPTIONS[bucket]).format(new Date(`${bucketStart}T00:00:00Z`));

interface ChartDatum {
  readonly bucketStart: string;
  readonly count: number;
  readonly label: string;
}

const CustomTooltip = ({ active, payload }: TooltipContentProps) => {
  if (!active || !payload || payload.length === 0) return null;
  const datum = payload[0]?.payload as ChartDatum | undefined;
  if (!datum) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-popover-foreground shadow-md">
      <div className="text-sm font-semibold">{datum.count.toLocaleString()}</div>
      <div className="text-xs text-muted-foreground">{datum.label}</div>
    </div>
  );
};

export interface TimeSeriesChartProps {
  readonly points: readonly TimeSeriesPoint[];
  readonly bucket: TimeSeriesBucket;
}

export const TimeSeriesChart = ({ points, bucket }: TimeSeriesChartProps) => {
  const data: ChartDatum[] = points.map((point) => ({
    bucketStart: point.bucketStart,
    count: point.count,
    label: formatBucketLabel(point.bucketStart, bucket)
  }));

  const seriesColor = CHART_SERIES_COLOR_VARS[0] ?? 'var(--primary)';

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={160}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
          width={32}
        />
        <Tooltip content={CustomTooltip} cursor={{ stroke: 'var(--border)' }} />
        <Line
          type="monotone"
          dataKey="count"
          stroke={seriesColor}
          strokeWidth={2}
          dot={{ r: 3, fill: seriesColor, stroke: 'var(--card)', strokeWidth: 2 }}
          activeDot={{ r: 5, fill: seriesColor, stroke: 'var(--card)', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
