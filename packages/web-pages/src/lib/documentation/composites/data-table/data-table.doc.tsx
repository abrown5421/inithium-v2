import * as React from 'react';
import { Badge, Button, DataTable, type DataTableColumn } from '@inithium/ui';
import { Pencil } from 'lucide-react';
import { CompositeDocView } from '../components/composite-doc-view.js';
import type { CompositeDoc } from '../composite-doc.types.js';

interface MockUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: 'Admin' | 'Member';
}

const MOCK_USERS: readonly MockUser[] = [
  { id: '1', name: 'Jordan Lee', email: 'jordan@acme.com', role: 'Admin' },
  { id: '2', name: 'Sam Patel', email: 'sam@acme.com', role: 'Member' },
  { id: '3', name: 'Casey Kim', email: 'casey@acme.com', role: 'Member' },
];

const COLUMNS: readonly DataTableColumn<MockUser>[] = [
  { key: 'name', header: 'Name', render: (user) => user.name },
  { key: 'email', header: 'Email', render: (user) => user.email },
  {
    key: 'role',
    header: 'Role',
    render: (user) => <Badge variant="outlined" color={user.role === 'Admin' ? 'primary' : undefined}>{user.role}</Badge>,
  },
];

const DataTableDemo = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedIds, setSelectedIds] = React.useState<ReadonlySet<string>>(new Set());

  const toggleRow = (id: string, checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const toggleAllOnPage = (checked: boolean) => {
    setSelectedIds(checked ? new Set(MOCK_USERS.map((user) => user.id)) : new Set());
  };

  return (
    <div className="w-full">
      <DataTable
        columns={COLUMNS}
        rows={MOCK_USERS}
        getRowId={(user) => user.id}
        getRowLabel={(user) => user.name}
        isLoading={false}
        currentPage={currentPage}
        totalPages={3}
        onPageChange={setCurrentPage}
        selectable
        selectedIds={selectedIds}
        onToggleRow={toggleRow}
        onToggleAllOnPage={toggleAllOnPage}
        renderRowActions={() => (
          <Button type="button" variant="ghost" size="icon" aria-label="Edit">
            <Pencil className="size-4" />
          </Button>
        )}
      />
    </div>
  );
};

const DATA_TABLE_DOC: CompositeDoc = {
  overview: (
    <>
      DataTable is a paginated, optionally-selectable table: a loading state, a checkbox column with
      select-all/indeterminate header state, arbitrary typed data columns, an optional row-actions
      column, and a centered pagination footer. It's entity-agnostic and fully controlled — no internal
      data fetching — so permission gating (whether selectable/renderRowActions are even passed) is the
      caller's responsibility. Enterprise use cases: every CMS management page's record list, and the
      table UserPicker opens inside its selection dialog.
    </>
  ),
  importStatement: "import { DataTable } from '@inithium/ui';",
  composition: [
    { name: 'Table / TableHeader / TableBody / TableRow / TableHead / TableCell', role: 'The underlying markup for every row and column.' },
    { name: 'Checkbox', role: "The selection column, with an indeterminate header state when some but not all of the current page is selected." },
    { name: 'Spinner', role: 'Replaces the whole table while isLoading, and shows small beside pagination during a background isFetching refetch.' },
    { name: 'PaginationControl', role: 'The footer pager.' },
  ],
  propGroups: [
    {
      component: 'DataTable<TRow>',
      props: [
        { name: 'columns', type: 'readonly DataTableColumn<TRow>[]', required: true, description: 'Column definitions: key, header, render(row), optional align.' },
        { name: 'rows', type: 'readonly TRow[]', required: true, description: 'Rows for the current page.' },
        { name: 'getRowId', type: '(row: TRow) => string', required: true, description: 'Stable row identifier, used for selection and React keys.' },
        { name: 'isLoading', type: 'boolean', required: true, description: 'Replaces the table with a centered Spinner.' },
        { name: 'isFetching', type: 'boolean', defaultValue: 'false', description: 'Shows a small spinner beside pagination without replacing the table.' },
        { name: 'currentPage', type: 'number', required: true, description: 'Controlled current page.' },
        { name: 'totalPages', type: 'number', required: true, description: 'Total page count.' },
        { name: 'onPageChange', type: '(page: number) => void', required: true, description: 'Called when the user changes pages.' },
        { name: 'selectable', type: 'boolean', defaultValue: 'false', description: 'Adds the checkbox column. Omit entirely when there is no bulk action for the selection.' },
        { name: 'selectedIds', type: 'ReadonlySet<string>', description: 'Currently selected row ids.' },
        { name: 'onToggleRow', type: '(id: string, checked: boolean) => void', description: 'Called when one row\'s checkbox changes.' },
        { name: 'onToggleAllOnPage', type: '(checked: boolean) => void', description: 'Called from the header checkbox.' },
        { name: 'renderRowActions', type: '(row: TRow) => React.ReactNode', description: 'Renders an actions column (e.g. edit/delete icon buttons). Omitted entirely when not provided.' },
        { name: 'emptyMessage', type: 'React.ReactNode', defaultValue: "'No records found'", description: 'Shown in place of rows when the page is empty.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Selectable table with row actions',
      description: 'Rows and pagination are mocked locally here — DataTable itself has no data-fetching of its own.',
      code: `const COLUMNS: DataTableColumn<User>[] = [
  { key: 'name', header: 'Name', render: (u) => u.name },
  { key: 'email', header: 'Email', render: (u) => u.email },
  { key: 'role', header: 'Role', render: (u) => <Badge variant="outlined">{u.role}</Badge> }
];

<DataTable
  columns={COLUMNS}
  rows={users}
  getRowId={(u) => u.id}
  isLoading={false}
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
  selectable
  selectedIds={selectedIds}
  onToggleRow={toggleRow}
  onToggleAllOnPage={toggleAllOnPage}
  renderRowActions={(u) => <Button variant="ghost" size="icon"><Pencil className="size-4" /></Button>}
/>`,
      preview: <DataTableDemo />,
    },
  ],
};

export const DataTableDoc = () => <CompositeDocView doc={DATA_TABLE_DOC} />;
