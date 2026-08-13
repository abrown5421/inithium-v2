import { Input, Label } from '@inithium/ui';
import type { TimeSeriesGraphWidgetConfig } from '@inithium/models';
import { CollectionSelectField, DateRangeFields } from '../../widget-config/index.js';

export interface TimeSeriesGraphWidgetConfigFormProps {
  readonly config: TimeSeriesGraphWidgetConfig;
  readonly onChange: (config: TimeSeriesGraphWidgetConfig) => void;
}

export const TimeSeriesGraphWidgetConfigForm = ({ config, onChange }: TimeSeriesGraphWidgetConfigFormProps) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="widget-title">Title</Label>
      <Input id="widget-title" value={config.title} onChange={(event) => onChange({ ...config, title: event.target.value })} />
    </div>
    <CollectionSelectField
      value={config.targetCollection}
      onChange={(targetCollection) => onChange({ ...config, targetCollection })}
    />
    <DateRangeFields
      value={{ dateFrom: config.dateFrom, dateTo: config.dateTo }}
      onChange={(range) => onChange({ ...config, ...range })}
    />
  </div>
);
