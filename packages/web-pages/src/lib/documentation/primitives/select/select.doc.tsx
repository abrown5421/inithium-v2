import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const SELECT_DOC: PrimitiveDoc = {
  overview: (
    <>
      Select is a fully custom-styled, keyboard-navigable dropdown built on Radix Select, sharing the
      error and color-token conventions used by Input. Enterprise use cases include single-choice form
      fields such as country, status, or role, where the option list may be long enough to need internal
      scrolling.
    </>
  ),
  importStatement: "import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from '@inithium/ui';",
  propGroups: [
    {
      component: 'SelectTrigger',
      props: [
        { name: 'error', type: 'boolean | string', description: 'Marks the field invalid and switches it to the destructive palette.' },
        { name: 'color', type: 'ColorToken', description: 'Focus-ring color. Omit for the neutral default.' },
      ],
    },
    {
      component: 'SelectItem',
      props: [
        { name: 'value', type: 'string', required: true, description: 'The value committed when this item is selected.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Prevents this option from being selected.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Grouped select field',
      code: `<Select defaultValue="in-progress">
  <SelectTrigger className="w-48">
    <SelectValue placeholder="Select status" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Status</SelectLabel>
      <SelectItem value="not-started">Not started</SelectItem>
      <SelectItem value="in-progress">In progress</SelectItem>
      <SelectItem value="done">Done</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`,
      preview: (
        <Select defaultValue="in-progress">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="not-started">Not started</SelectItem>
              <SelectItem value="in-progress">In progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      ),
    },
    {
      title: 'Invalid state',
      code: `<Select>
  <SelectTrigger error className="w-48">
    <SelectValue placeholder="Select a role" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="admin">Admin</SelectItem>
    <SelectItem value="member">Member</SelectItem>
  </SelectContent>
</Select>`,
      preview: (
        <Select>
          <SelectTrigger error className="w-48">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="member">Member</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
  ],
};

export const SelectDoc = () => <PrimitiveDocView doc={SELECT_DOC} />;
