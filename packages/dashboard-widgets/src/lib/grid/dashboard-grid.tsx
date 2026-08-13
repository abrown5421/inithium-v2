import { Button, Heading } from '@inithium/ui';
import type { WidgetLayoutItem } from '@inithium/models';
import { getWidgetDefinition, type WidgetDefinition } from '../registry/index.js';
import { EmptyDashboardState } from './empty-dashboard-state.js';
import { WidgetShell } from './widget-shell.js';

export interface DashboardGridProps {
  readonly widgets: readonly WidgetLayoutItem[];
  readonly isSaving: boolean;
  readonly onAddWidgetsClick: () => void;
  readonly onConfigureWidget: (widgetId: string) => void;
  readonly onRemoveWidget: (widgetId: string) => void;
}

export const DashboardGrid = ({
  widgets,
  isSaving,
  onAddWidgetsClick,
  onConfigureWidget,
  onRemoveWidget
}: DashboardGridProps) => (
  <div className="flex flex-1 flex-col">
    <div className="flex items-center justify-between p-4">
      <Heading font="secondary" level={1}>
        Dashboard
      </Heading>
      <Button type="button" color="primary" onClick={onAddWidgetsClick}>
        Add Widget
      </Button>
    </div>
    {widgets.length === 0 ? (
      <EmptyDashboardState onAddWidgetsClick={onAddWidgetsClick} />
    ) : (
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
        {widgets.map((widget) => {
          const widgetDefinition = getWidgetDefinition(widget.widgetType) as unknown as WidgetDefinition<typeof widget.config>;
          return (
            <WidgetShell
              key={widget.id}
              title={widgetDefinition.getTitle(widget.config)}
              onConfigure={() => onConfigureWidget(widget.id)}
              onRemove={() => onRemoveWidget(widget.id)}
            >
              {widgetDefinition.renderContainer({ id: widget.id, config: widget.config })}
            </WidgetShell>
          );
        })}
      </div>
    )}
  </div>
);
