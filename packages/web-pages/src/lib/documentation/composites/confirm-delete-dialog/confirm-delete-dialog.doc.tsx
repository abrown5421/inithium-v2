import * as React from 'react';
import { Button, ConfirmDeleteDialog } from '@inithium/ui';
import { CompositeDocView } from '../components/composite-doc-view.js';
import type { CompositeDoc } from '../composite-doc.types.js';

const ConfirmDeleteDialogDemo = () => {
  const [open, setOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleConfirm = () => {
    setIsDeleting(true);
    window.setTimeout(() => {
      setIsDeleting(false);
      setOpen(false);
    }, 1200);
  };

  return (
    <>
      <Button variant="outlined" color="destructive" onClick={() => setOpen(true)}>
        Delete project
      </Button>
      <ConfirmDeleteDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete this project?"
        description="This action cannot be undone. All associated data will be permanently removed."
        onConfirm={handleConfirm}
        isDeleting={isDeleting}
      />
    </>
  );
};

const CONFIRM_DELETE_DIALOG_DOC: CompositeDoc = {
  overview: (
    <>
      ConfirmDeleteDialog is a thin, opinionated wrapper around AlertDialog for single or bulk delete
      confirmation. Its confirm button doesn't use AlertDialogAction's default auto-close behavior — it
      calls preventDefault and only closes once the caller's onConfirm (and the isDeleting flag it
      controls) says so, so the dialog stays open if the deletion fails server-side. Enterprise use
      cases: every destructive delete action across the CMS management pages (users, assets, pages,
      settings).
    </>
  ),
  importStatement: "import { ConfirmDeleteDialog } from '@inithium/ui';",
  composition: [
    { name: 'AlertDialog', role: 'The modal interruption itself — cannot be dismissed by overlay click or Escape, only Cancel or the (overridden) confirm action.' },
    { name: 'AlertDialogAction', role: "Styled destructive via getButtonClassName; its default auto-close is intercepted so the caller's onConfirm controls when the dialog actually closes." },
  ],
  propGroups: [
    {
      component: 'ConfirmDeleteDialog',
      props: [
        { name: 'open', type: 'boolean', required: true, description: 'Controlled open state.' },
        { name: 'onOpenChange', type: '(open: boolean) => void', required: true, description: 'Called when the dialog should open or close (Cancel, Escape, outside click).' },
        { name: 'title', type: 'string', required: true, description: 'Dialog title.' },
        { name: 'description', type: 'React.ReactNode', required: true, description: 'Caller composes the singular/plural wording, e.g. "This will permanently delete 3 users."' },
        { name: 'onConfirm', type: '() => void', required: true, description: 'Called when the destructive action is confirmed. Does not close the dialog by itself.' },
        { name: 'isDeleting', type: 'boolean', required: true, description: 'Disables the confirm button and swaps its label to pendingLabel while true.' },
        { name: 'confirmLabel', type: 'string', defaultValue: "'Delete'", description: 'Confirm button label while idle.' },
        { name: 'pendingLabel', type: 'string', defaultValue: "'Deleting…'", description: 'Confirm button label while isDeleting is true.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Delete confirmation with a simulated pending state',
      code: `const [open, setOpen] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);

const handleConfirm = async () => {
  setIsDeleting(true);
  await deleteProject();
  setIsDeleting(false);
  setOpen(false);
};

<ConfirmDeleteDialog
  open={open}
  onOpenChange={setOpen}
  title="Delete this project?"
  description="This action cannot be undone. All associated data will be permanently removed."
  onConfirm={handleConfirm}
  isDeleting={isDeleting}
/>`,
      preview: <ConfirmDeleteDialogDemo />,
    },
  ],
};

export const ConfirmDeleteDialogDoc = () => <CompositeDocView doc={CONFIRM_DELETE_DIALOG_DOC} />;
