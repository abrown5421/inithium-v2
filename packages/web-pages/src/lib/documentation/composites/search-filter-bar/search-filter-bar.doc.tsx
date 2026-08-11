import * as React from 'react';
import { SearchFilterBar, type SearchFieldConfig } from '@inithium/ui';
import { CompositeDocView } from '../components/composite-doc-view.js';
import type { CompositeDoc } from '../composite-doc.types.js';

const DEMO_FIELDS: readonly SearchFieldConfig[] = [
  { value: 'name', label: 'Name', type: 'string' },
  { value: 'active', label: 'Active', type: 'boolean' },
  {
    value: 'role',
    label: 'Role',
    type: 'enum',
    options: [
      { value: 'admin', label: 'Admin' },
      { value: 'member', label: 'Member' },
    ],
  },
];

const SearchFilterBarDemo = () => {
  const [field, setField] = React.useState(DEMO_FIELDS[0].value);
  const [value, setValue] = React.useState('');

  return (
    <SearchFilterBar
      fields={DEMO_FIELDS}
      field={field}
      value={value}
      onFieldChange={(nextField) => {
        setField(nextField);
        setValue('');
      }}
      onValueChange={setValue}
    />
  );
};

const SEARCH_FILTER_BAR_DOC: CompositeDoc = {
  overview: (
    <>
      SearchFilterBar pairs a field-picker Select with a value widget whose control type follows the
      active field: free-text search gets an Input, while enum/boolean fields get a Select restricted to
      valid values — free text can never match a closed set, so those types never render a text box.
      Enterprise use cases: the search/filter row on every CMS management page (users, assets, pages),
      and the same contract reused internally by AssetPicker and UserPicker.
    </>
  ),
  importStatement: "import { SearchFilterBar } from '@inithium/ui';",
  composition: [
    { name: 'Select (field picker)', role: 'Chooses which field is being searched, from fields.' },
    { name: 'Input', role: "Free-text value widget, rendered only when the active field's type is 'string'." },
    { name: 'Select (value picker)', role: "Value widget for 'enum' (from field.options) and 'boolean' (fixed True/False) field types." },
  ],
  propGroups: [
    {
      component: 'SearchFilterBar',
      props: [
        { name: 'fields', type: 'readonly SearchFieldConfig[]', required: true, description: 'Searchable fields: value, label, type, and options for enum fields.' },
        { name: 'field', type: 'string', required: true, description: 'The currently active field\'s value.' },
        { name: 'value', type: 'string', required: true, description: 'The current search value for the active field.' },
        { name: 'onFieldChange', type: '(field: string) => void', required: true, description: 'Called when the active field changes.' },
        { name: 'onValueChange', type: '(value: string) => void', required: true, description: 'Called when the search value changes.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Mixed string/boolean/enum fields',
      description: 'Switching to a non-string field replaces the free-text Input with a constrained Select — this demo resets value on field change, matching useEntityListState\'s real behavior.',
      code: `const FIELDS: SearchFieldConfig[] = [
  { value: 'name', label: 'Name', type: 'string' },
  { value: 'active', label: 'Active', type: 'boolean' },
  { value: 'role', label: 'Role', type: 'enum', options: [
    { value: 'admin', label: 'Admin' },
    { value: 'member', label: 'Member' }
  ]}
];

<SearchFilterBar fields={FIELDS} field={field} value={value} onFieldChange={setField} onValueChange={setValue} />`,
      preview: <SearchFilterBarDemo />,
    },
  ],
};

export const SearchFilterBarDoc = () => <CompositeDocView doc={SEARCH_FILTER_BAR_DOC} />;
