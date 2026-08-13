import type { ReactNode } from 'react';
import { Settings, Trash2 } from 'lucide-react';
import { Button, Card, CardAction, CardContent, CardHeader, CardTitle } from '@inithium/ui';

export interface WidgetShellProps {
  readonly title: string;
  readonly onConfigure: () => void;
  readonly onRemove: () => void;
  readonly children: ReactNode;
}

export const WidgetShell = ({ title, onConfigure, onRemove, children }: WidgetShellProps) => (
  <Card className="flex h-96 flex-col overflow-hidden py-4">
    <CardHeader className="px-4">
      <CardTitle className="truncate text-sm">{title}</CardTitle>
      <CardAction className="flex items-center gap-1">
        <Button type="button" variant="ghost" size="icon" aria-label="Configure widget" onClick={onConfigure}>
          <Settings className="size-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" aria-label="Remove widget" onClick={onRemove}>
          <Trash2 className="size-4" />
        </Button>
      </CardAction>
    </CardHeader>
    <CardContent className="flex-1 overflow-hidden px-4">{children}</CardContent>
  </Card>
);
