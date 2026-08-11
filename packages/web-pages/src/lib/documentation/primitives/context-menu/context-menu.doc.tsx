import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  Text,
} from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const CONTEXT_MENU_DOC: PrimitiveDoc = {
  overview: (
    <>
      ContextMenu renders a right-click (or long-press) contextual menu anchored to the cursor, sharing
      the same item, checkbox, radio, and submenu primitives as DropdownMenu. Enterprise use cases include
      right-click actions on table rows, canvas or board items, and file-manager entries.
    </>
  ),
  importStatement: "import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from '@inithium/ui';",
  propGroups: [
    {
      component: 'ContextMenuContent',
      props: [
        { name: 'alignOffset', type: 'number', description: 'Offset along the alignment axis from the pointer position.' },
      ],
    },
    {
      component: 'ContextMenuItem',
      props: [
        { name: 'inset', type: 'boolean', defaultValue: 'false', description: 'Adds left padding to align with items that have a leading icon or indicator.' },
        { name: 'variant', type: "'default' | 'destructive'", defaultValue: "'default'", description: 'Colors the item for destructive actions like delete.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Right-click surface',
      code: `<ContextMenu>
  <ContextMenuTrigger className="flex h-32 w-full max-w-sm items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
    Right-click this area
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Rename</ContextMenuItem>
    <ContextMenuItem>Duplicate</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`,
      preview: (
        <ContextMenu>
          <ContextMenuTrigger className="flex h-32 w-full max-w-sm items-center justify-center rounded-lg border border-dashed border-border">
            <Text size="sm" color="muted">Right-click this area</Text>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Rename</ContextMenuItem>
            <ContextMenuItem>Duplicate</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ),
    },
  ],
};

export const ContextMenuDoc = () => <PrimitiveDocView doc={CONTEXT_MENU_DOC} />;
