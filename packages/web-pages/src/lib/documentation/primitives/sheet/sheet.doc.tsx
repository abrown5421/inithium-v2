import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const SHEET_DOC: PrimitiveDoc = {
  overview: (
    <>
      Sheet is a side-anchored panel (drawer) built on Radix Dialog, sliding in from any of the four
      edges via the <code>side</code> prop while sharing Dialog's modal and focus-trap behavior.
      Enterprise use cases include mobile navigation drawers — this documentation page's own mobile nav
      uses it — filter panels, and detail side-panels triggered from a table row.
    </>
  ),
  importStatement: "import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@inithium/ui';",
  propGroups: [
    {
      component: 'SheetContent',
      props: [
        { name: 'side', type: "'top' | 'bottom' | 'left' | 'right'", defaultValue: "'right'", description: 'Edge of the viewport the panel slides in from.' },
        { name: 'showCloseButton', type: 'boolean', defaultValue: 'true', description: 'Renders the built-in top-right close button.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Right-side detail panel',
      code: `<Sheet>
  <SheetTrigger asChild>
    <Button variant="outlined">View details</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Order #4821</SheetTitle>
      <SheetDescription>Placed 2 hours ago</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>`,
      preview: (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outlined">View details</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Order #4821</SheetTitle>
              <SheetDescription>Placed 2 hours ago</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ),
    },
    {
      title: 'Left-side navigation drawer',
      description: 'Set `side="left"` for a mobile navigation drawer, as used in this documentation page.',
      code: `<Sheet>
  <SheetTrigger asChild>
    <Button variant="outlined">Menu</Button>
  </SheetTrigger>
  <SheetContent side="left">
    <SheetHeader>
      <SheetTitle>Navigation</SheetTitle>
    </SheetHeader>
  </SheetContent>
</Sheet>`,
      preview: (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outlined">Menu</Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ),
    },
  ],
};

export const SheetDoc = () => <PrimitiveDocView doc={SHEET_DOC} />;
