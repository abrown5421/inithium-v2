import { Input, Label } from '@inithium/ui';
import type { ErrorLogWidgetConfig } from '@inithium/models';

export interface ErrorLogWidgetConfigFormProps {
  readonly config: ErrorLogWidgetConfig;
  readonly onChange: (config: ErrorLogWidgetConfig) => void;
}

export const ErrorLogWidgetConfigForm = ({ config, onChange }: ErrorLogWidgetConfigFormProps) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="widget-title">Title</Label>
      <Input id="widget-title" value={config.title} onChange={(event) => onChange({ ...config, title: event.target.value })} />
    </div>
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="widget-page-size">Rows per page</Label>
      <Input
        id="widget-page-size"
        type="number"
        min={1}
        max={50}
        value={config.pageSize}
        onChange={(event) => onChange({ ...config, pageSize: Number(event.target.value) || 1 })}
      />
    </div>
  </div>
);
