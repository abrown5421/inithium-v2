import { LayoutGrid } from 'lucide-react';
import { Button, Heading, Text } from '@inithium/ui';

export interface EmptyDashboardStateProps {
  readonly onAddWidgetsClick: () => void;
}

export const EmptyDashboardState = ({ onAddWidgetsClick }: EmptyDashboardStateProps) => (
  <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-center">
    <LayoutGrid className="size-10 text-muted-foreground" aria-hidden="true" />
    <Heading level={3} font="secondary">
      Your dashboard is empty
    </Heading>
    <Text size="sm" className="max-w-sm">
      Add widgets to start monitoring activity across your collections.
    </Text>
    <Button type="button" onClick={onAddWidgetsClick}>
      Add Widgets
    </Button>
  </div>
);
