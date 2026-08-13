import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@inithium/ui';
import { useWidgetDefinitionList } from '../registry/widget-registry.js';
import type { WidgetDefinition } from '../registry/widget-types.js';
import { WidgetPickerItem } from './widget-picker-item.js';

export interface AddWidgetDrawerProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSelectWidget: (widgetDefinition: WidgetDefinition<never>) => void;
}

export const AddWidgetDrawer = ({ open, onOpenChange, onSelectWidget }: AddWidgetDrawerProps) => {
  const widgetDefinitions = useWidgetDefinitionList();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Add Widgets</SheetTitle>
          <SheetDescription>Choose a widget to add to your dashboard.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2 overflow-y-auto px-1">
          {widgetDefinitions.map((widgetDefinition) => (
            <WidgetPickerItem
              key={widgetDefinition.widgetType}
              widgetDefinition={widgetDefinition}
              onSelect={() => onSelectWidget(widgetDefinition)}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
