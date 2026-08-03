import * as React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../../primitives/alert-dialog.js';
import { buttonVariants } from '../../primitives/button.js';
import type { ConfirmDeleteDialogProps } from './confirm-delete-dialog.types.js';

/**
 * Single/bulk delete confirmation. The confirm button isn't `AlertDialogAction`'s default
 * auto-close behavior — it calls `preventDefault` and closes only via the caller's `onConfirm`
 * (through `onOpenChange`), so the dialog stays open if the deletion fails.
 */
export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isDeleting,
  confirmLabel = 'Delete',
  pendingLabel = 'Deleting…'
}) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          className={buttonVariants({ variant: 'destructive' })}
          disabled={isDeleting}
          onClick={(event) => {
            event.preventDefault();
            onConfirm();
          }}
        >
          {isDeleting ? pendingLabel : confirmLabel}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
