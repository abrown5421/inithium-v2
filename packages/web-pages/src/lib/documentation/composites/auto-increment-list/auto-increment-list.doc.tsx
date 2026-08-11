import * as React from 'react';
import { AutoIncrementList, Input } from '@inithium/ui';
import { CompositeDocView } from '../components/composite-doc-view.js';
import type { CompositeDoc } from '../composite-doc.types.js';

let controlledRowId = 0;
const createControlledRow = () => ({ id: controlledRowId++, value: '' });

const ControlledAutoIncrementDemo = () => {
  const [rows, setRows] = React.useState(() => [createControlledRow()]);

  return (
    <AutoIncrementList
      values={rows}
      onValuesChange={setRows}
      createItem={createControlledRow}
      getRowKey={(row) => row.id}
      renderItem={({ value, onChange }) => (
        <Input
          placeholder="Row value"
          value={value.value}
          onChange={(event) => onChange({ ...value, value: event.target.value })}
        />
      )}
      className="w-full max-w-sm"
    />
  );
};

const AUTO_INCREMENT_LIST_DOC: CompositeDoc = {
  overview: (
    <>
      AutoIncrementList is a vertical row list with add/remove affordances: the last row always shows an
      increment (+) button, every row above it shows a destructive-colored decrement (-) button. It has
      two distinct modes — uncontrolled, where the list owns its own row count and re-renders the same{' '}
      <code>item</code> node per row, and controlled, where the caller owns the row data as a plain array
      and supplies <code>createItem</code>/<code>renderItem</code>. Enterprise use cases include
      dynamic multi-value form fields (tags, alternate emails) and, in controlled mode, recursive
      structures like SettingValueEditor's array/object nodes.
    </>
  ),
  importStatement: "import { AutoIncrementList } from '@inithium/ui';",
  composition: [
    { name: 'Button', role: "The +/- affordances — size='icon', destructive color on remove, default color on add." },
  ],
  propGroups: [
    {
      component: 'AutoIncrementList (uncontrolled)',
      props: [
        { name: 'item', type: 'React.ReactNode', description: 'Template re-rendered unchanged in every row; each mounts its own independent state. Ignored once the controlled props below are all supplied.' },
      ],
    },
    {
      component: 'AutoIncrementList (controlled)',
      props: [
        { name: 'values', type: 'readonly T[]', description: 'The current row values — supplying this switches the list to controlled mode.' },
        { name: 'onValuesChange', type: '(values: readonly T[]) => void', description: 'Called with the full next array on every add/remove/edit.' },
        { name: 'createItem', type: '() => T', description: "Builds a new row's value when + is pressed." },
        { name: 'renderItem', type: '(params: AutoIncrementListRenderParams<T>) => React.ReactNode', description: "Renders one row's editable content for its current value." },
        { name: 'getRowKey', type: '(value: T, index: number) => React.Key', description: 'Stable per-row React key keyed off the value, not array position. Falls back to index.' },
        { name: 'getRowContentClassName', type: '(value: T, index: number) => string', defaultValue: "'min-w-0 flex-1'", description: 'Class name for a row\'s content wrapper.' },
      ],
    },
    {
      component: 'AutoIncrementList (shared)',
      props: [
        { name: 'className', type: 'string', description: 'Class name for the outer list container.' },
        { name: 'rowClassName', type: 'string', description: 'Class name applied to every row.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Uncontrolled — self-managed rows',
      description: 'Each row mounts its own independent Input instance; there is no way to read the rows\' contents back out.',
      code: `<AutoIncrementList item={<Input placeholder="Row value" />} />`,
      preview: <AutoIncrementList item={<Input placeholder="Row value" />} className="w-full max-w-sm" />,
    },
    {
      title: 'Controlled — caller-owned row data',
      description: 'The array, stable row ids, and rendering are all owned by the caller — the pattern SettingValueEditor uses for array/object editing.',
      code: `let nextId = 0;
const [rows, setRows] = useState(() => [{ id: nextId++, value: '' }]);

<AutoIncrementList
  values={rows}
  onValuesChange={setRows}
  createItem={() => ({ id: nextId++, value: '' })}
  getRowKey={(row) => row.id}
  renderItem={({ value, onChange }) => (
    <Input value={value.value} onChange={(e) => onChange({ ...value, value: e.target.value })} />
  )}
/>`,
      preview: <ControlledAutoIncrementDemo />,
    },
  ],
};

export const AutoIncrementListDoc = () => <CompositeDocView doc={AUTO_INCREMENT_LIST_DOC} />;
