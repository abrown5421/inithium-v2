import { TriangleAlert, Trash2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle, Button, Card, CardContent } from '@inithium/ui';

export interface UnknownWidgetPlaceholderProps {
  readonly widgetType: string;
  readonly onRemove: () => void;
}

/**
 * Rendered when a persisted widget's `widgetType` has no matching definition — typically because
 * the plugin that registered it was disabled or uninstalled. Degrades gracefully instead of
 * crashing the dashboard; offers removal since there's no config UI to fall back to.
 */
export const UnknownWidgetPlaceholder = ({ widgetType, onRemove }: UnknownWidgetPlaceholderProps) => (
  <Card className="flex h-96 flex-col overflow-hidden py-4">
    <CardContent className="flex flex-1 flex-col justify-center px-4">
      <Alert color="warning">
        <TriangleAlert />
        <AlertTitle>Unknown widget</AlertTitle>
        <AlertDescription>
          <span>
            No widget is registered for type <strong>&quot;{widgetType}&quot;</strong>. The plugin that added it may be
            disabled or uninstalled.
          </span>
          <Button type="button" variant="outlined" size="sm" onClick={onRemove}>
            <Trash2 className="size-4" />
            Remove widget
          </Button>
        </AlertDescription>
      </Alert>
    </CardContent>
  </Card>
);
