import type { WidgetDefinition } from '../registry/widget-types.js';

export interface WidgetPickerItemProps {
  readonly widgetDefinition: WidgetDefinition<never>;
  readonly onSelect: () => void;
}

export const WidgetPickerItem = ({ widgetDefinition, onSelect }: WidgetPickerItemProps) => {
  const Icon = widgetDefinition.icon;
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-start gap-3 rounded-md border border-border p-3 text-left transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <Icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{widgetDefinition.displayName}</span>
        <span className="text-xs text-muted-foreground">{widgetDefinition.description}</span>
      </div>
    </button>
  );
};
