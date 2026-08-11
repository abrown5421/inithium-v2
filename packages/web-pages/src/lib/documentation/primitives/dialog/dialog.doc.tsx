import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const DIALOG_DOC: PrimitiveDoc = {
  overview: (
    <>
      Dialog is a modal window built on Radix Dialog that traps focus and blocks interaction with the
      page behind an overlay until dismissed. Enterprise use cases include create/edit-entity forms,
      confirmation prompts with arbitrary content, and settings panels opened from a button.
    </>
  ),
  importStatement: "import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@inithium/ui';",
  propGroups: [
    {
      component: 'Dialog',
      props: [
        { name: 'open', type: 'boolean', description: 'Controlled open state.' },
        { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the open state changes.' },
      ],
    },
    {
      component: 'DialogContent',
      props: [
        { name: 'showCloseButton', type: 'boolean', defaultValue: 'true', description: 'Renders the built-in top-right close button.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Edit entity form',
      code: `<Dialog>
  <DialogTrigger asChild>
    <Button variant="outlined">Edit profile</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>Update your account details below.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outlined">Cancel</Button>
      <Button>Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
      preview: (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outlined">Edit profile</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>Update your account details below.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outlined">Cancel</Button>
              <Button>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ),
    },
  ],
};

export const DialogDoc = () => <PrimitiveDocView doc={DIALOG_DOC} />;
