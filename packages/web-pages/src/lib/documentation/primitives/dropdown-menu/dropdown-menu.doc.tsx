import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const DROPDOWN_MENU_DOC: PrimitiveDoc = {
  overview: (
    <>
      DropdownMenu is a floating action menu built on Radix Dropdown Menu, supporting checkbox items,
      radio items, nested submenus, and a destructive item variant. Enterprise use cases include
      row-level "…" action menus in data tables, user-account menus, and bulk-action toolbars.
    </>
  ),
  importStatement: "import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '@inithium/ui';",
  propGroups: [
    {
      component: 'DropdownMenuContent',
      props: [
        { name: 'sideOffset', type: 'number', defaultValue: '4', description: 'Pixel distance from the trigger.' },
      ],
    },
    {
      component: 'DropdownMenuItem',
      props: [
        { name: 'inset', type: 'boolean', defaultValue: 'false', description: 'Adds left padding to align with items that have a leading icon or indicator.' },
        { name: 'variant', type: "'default' | 'destructive'", defaultValue: "'default'", description: 'Colors the item for destructive actions like delete.' },
      ],
    },
    {
      component: 'DropdownMenuCheckboxItem',
      props: [
        { name: 'checked', type: 'boolean', description: 'Controlled checked state of the toggleable item.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Row action menu',
      code: `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outlined">Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>Row actions</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Duplicate</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
      preview: (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outlined">Actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Row actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      title: 'Toggleable columns',
      description: 'DropdownMenuCheckboxItem keeps the menu open and reflects a boolean toggle state, useful for column visibility controls.',
      code: `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outlined">Columns</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuCheckboxItem checked>Name</DropdownMenuCheckboxItem>
    <DropdownMenuCheckboxItem checked>Status</DropdownMenuCheckboxItem>
    <DropdownMenuCheckboxItem>Owner</DropdownMenuCheckboxItem>
  </DropdownMenuContent>
</DropdownMenu>`,
      preview: (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outlined">Columns</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem checked>Name</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked>Status</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Owner</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ],
};

export const DropdownMenuDoc = () => <PrimitiveDocView doc={DROPDOWN_MENU_DOC} />;
