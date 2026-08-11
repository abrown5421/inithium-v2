import { Combobox } from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const OWNER_OPTIONS = [
  { value: 'jordan', label: 'Jordan Lee' },
  { value: 'sam', label: 'Sam Patel' },
  { value: 'casey', label: 'Casey Kim' },
];

const COMBOBOX_DOC: PrimitiveDoc = {
  overview: (
    <>
      Combobox is a single-select, searchable dropdown composed from Popover, Command, and Button, giving
      a type-to-filter experience for long option lists without manually wiring Popover and Command
      together. Enterprise use cases include assigning an owner from a long user list, selecting a
      country or timezone, and tag pickers.
    </>
  ),
  importStatement: "import { Combobox } from '@inithium/ui';",
  propGroups: [
    {
      component: 'Combobox',
      props: [
        { name: 'options', type: '{ value: string; label: string; disabled?: boolean }[]', required: true, description: 'The list of selectable options.' },
        { name: 'value', type: 'string', description: 'Controlled selected value.' },
        { name: 'defaultValue', type: 'string', description: 'Uncontrolled initial selected value.' },
        { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the selected value changes.' },
        { name: 'placeholder', type: 'string', defaultValue: "'Select an option…'", description: 'Trigger text shown when nothing is selected.' },
        { name: 'searchPlaceholder', type: 'string', defaultValue: "'Search…'", description: 'Placeholder for the internal search field.' },
        { name: 'emptyText', type: 'string', defaultValue: "'No results found.'", description: 'Text shown when no options match the search.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the trigger.' },
        { name: 'error', type: 'boolean | string', description: 'Marks the field invalid and switches it to the destructive palette.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Owner picker',
      code: `const OWNER_OPTIONS = [
  { value: 'jordan', label: 'Jordan Lee' },
  { value: 'sam', label: 'Sam Patel' },
  { value: 'casey', label: 'Casey Kim' },
];

<Combobox
  options={OWNER_OPTIONS}
  defaultValue="jordan"
  placeholder="Select an owner…"
  searchPlaceholder="Search people…"
  triggerClassName="w-56"
/>`,
      preview: (
        <Combobox
          options={OWNER_OPTIONS}
          defaultValue="jordan"
          placeholder="Select an owner…"
          searchPlaceholder="Search people…"
          triggerClassName="w-56"
        />
      ),
    },
  ],
};

export const ComboboxDoc = () => <PrimitiveDocView doc={COMBOBOX_DOC} />;
