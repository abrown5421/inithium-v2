import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const COMMAND_DOC: PrimitiveDoc = {
  overview: (
    <>
      Command is a filterable command-palette list built on <code>cmdk</code>, usable inline or wrapped in
      CommandDialog for a ⌘K-style modal launcher. Enterprise use cases include a global command palette
      for quick navigation, and inline searchable action lists inside a larger panel.
    </>
  ),
  importStatement: "import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator, CommandShortcut } from '@inithium/ui';",
  propGroups: [
    {
      component: 'CommandInput',
      props: [
        { name: 'placeholder', type: 'string', description: 'Placeholder text for the search field.' },
      ],
    },
    {
      component: 'CommandItem',
      props: [
        { name: 'value', type: 'string', description: 'Text used for filtering; defaults to the item\'s text content.' },
        { name: 'onSelect', type: '(value: string) => void', description: 'Called when the item is chosen via click or Enter.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Excludes the item from keyboard navigation and selection.' },
      ],
    },
    {
      component: 'CommandDialog',
      props: [
        { name: 'title', type: 'string', defaultValue: "'Command Palette'", description: 'Accessible dialog title, visually hidden.' },
        { name: 'description', type: 'string', defaultValue: "'Search for a command to run…'", description: 'Accessible dialog description, visually hidden.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Inline command list',
      code: `<Command className="rounded-lg border border-border">
  <CommandInput placeholder="Type a command…" />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Navigation">
      <CommandItem>Go to dashboard</CommandItem>
      <CommandItem>Go to settings</CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Actions">
      <CommandItem>
        Create project
        <CommandShortcut>⌘N</CommandShortcut>
      </CommandItem>
    </CommandGroup>
  </CommandList>
</Command>`,
      preview: (
        <Command className="w-full max-w-sm rounded-lg border border-border">
          <CommandInput placeholder="Type a command…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              <CommandItem>Go to dashboard</CommandItem>
              <CommandItem>Go to settings</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Actions">
              <CommandItem>
                Create project
                <CommandShortcut>⌘N</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      ),
    },
  ],
};

export const CommandDoc = () => <PrimitiveDocView doc={COMMAND_DOC} />;
