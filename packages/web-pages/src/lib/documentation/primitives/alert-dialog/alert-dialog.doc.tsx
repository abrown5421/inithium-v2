import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const ALERT_DIALOG_DOC: PrimitiveDoc = {
  overview: (
    <>
      AlertDialog is a modal interruption built on Radix Alert Dialog for actions that require explicit
      confirmation. Unlike Dialog, it cannot be dismissed by clicking the overlay or pressing Escape —
      the user must choose AlertDialogAction or AlertDialogCancel. Enterprise use cases include
      destructive delete confirmations, irreversible bulk actions, and session-expiry prompts.
    </>
  ),
  importStatement: "import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from '@inithium/ui';",
  propGroups: [
    {
      component: 'AlertDialog',
      props: [
        { name: 'open', type: 'boolean', description: 'Controlled open state.' },
        { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the open state changes.' },
      ],
    },
    {
      component: 'AlertDialogAction / AlertDialogCancel',
      props: [
        { name: 'onClick', type: '() => void', description: 'Confirms or cancels the pending action. Styled as a solid Button (Action) or outlined Button (Cancel).' },
      ],
    },
  ],
  examples: [
    {
      title: 'Destructive delete confirmation',
      code: `<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="outlined" color="destructive">Delete project</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete this project?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. All associated data will be permanently removed.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,
      preview: (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outlined" color="destructive">Delete project</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this project?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. All associated data will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
    },
  ],
};

export const AlertDialogDoc = () => <PrimitiveDocView doc={ALERT_DIALOG_DOC} />;
