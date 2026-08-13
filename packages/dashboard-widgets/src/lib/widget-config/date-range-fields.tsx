import { Button, Input, Label } from '@inithium/ui';

export interface DateRange {
  readonly dateFrom: string;
  readonly dateTo: string;
}

export interface DateRangeFieldsProps {
  readonly value: DateRange;
  readonly onChange: (range: DateRange) => void;
}

const DATE_RANGE_PRESETS: readonly { readonly label: string; readonly days: number }[] = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 }
];

const toIsoDate = (date: Date): string => date.toISOString().slice(0, 10);

const applyPreset = (days: number): DateRange => {
  const dateTo = new Date();
  const dateFrom = new Date(dateTo);
  dateFrom.setDate(dateFrom.getDate() - days);
  return { dateFrom: toIsoDate(dateFrom), dateTo: toIsoDate(dateTo) };
};

export const DateRangeFields = ({ value, onChange }: DateRangeFieldsProps) => (
  <div className="flex flex-col gap-2">
    <div className="flex gap-2">
      <div className="flex flex-1 flex-col gap-1.5">
        <Label htmlFor="widget-date-from">From</Label>
        <Input
          id="widget-date-from"
          type="date"
          value={value.dateFrom}
          max={value.dateTo}
          onChange={(event) => onChange({ dateFrom: event.target.value, dateTo: value.dateTo })}
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <Label htmlFor="widget-date-to">To</Label>
        <Input
          id="widget-date-to"
          type="date"
          value={value.dateTo}
          min={value.dateFrom}
          onChange={(event) => onChange({ dateFrom: value.dateFrom, dateTo: event.target.value })}
        />
      </div>
    </div>
    <div className="flex gap-2">
      {DATE_RANGE_PRESETS.map((preset) => (
        <Button key={preset.label} type="button" variant="outlined" size="sm" onClick={() => onChange(applyPreset(preset.days))}>
          {preset.label}
        </Button>
      ))}
    </div>
  </div>
);
