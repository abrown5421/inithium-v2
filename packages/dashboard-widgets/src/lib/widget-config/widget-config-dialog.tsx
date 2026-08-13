import { useEffect, useState } from 'react';
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@inithium/ui';
import type { WidgetDefinition } from '../registry/widget-types.js';

export interface WidgetConfigDialogProps<TConfig> {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly widgetDefinition: WidgetDefinition<TConfig>;
  readonly config: TConfig;
  readonly onSave: (config: TConfig) => void;
}

export const WidgetConfigDialog = <TConfig,>({
  open,
  onOpenChange,
  widgetDefinition,
  config,
  onSave
}: WidgetConfigDialogProps<TConfig>) => {
  const [draft, setDraft] = useState<TConfig>(config);

  useEffect(() => {
    if (open) setDraft(config);
  }, [open, config]);

  const handleSave = (): void => {
    onSave(draft);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure {widgetDefinition.displayName}</DialogTitle>
        </DialogHeader>
        {widgetDefinition.renderConfigForm({ config: draft, onChange: setDraft })}
        <DialogFooter>
          <Button type="button" variant="outlined" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
