import * as React from 'react';

export interface ConfirmDeleteDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly title: string;
  /** Caller composes the singular/plural wording (e.g. "This will permanently delete 3 users."). */
  readonly description: React.ReactNode;
  readonly onConfirm: () => void;
  readonly isDeleting: boolean;
  readonly confirmLabel?: string;
  readonly pendingLabel?: string;
}
