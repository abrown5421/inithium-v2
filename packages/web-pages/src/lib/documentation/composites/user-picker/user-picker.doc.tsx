import * as React from 'react';
import {
  Button,
  DataTable,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  SearchFilterBar,
  type DataTableColumn,
  type SearchFieldConfig,
} from '@inithium/ui';
import { ChevronsUpDown } from 'lucide-react';
import { CompositeDocView } from '../components/composite-doc-view.js';
import type { CompositeDoc } from '../composite-doc.types.js';

interface MockUser {
  readonly id: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly email: string;
  readonly role: string;
}

const MOCK_USERS: readonly MockUser[] = [
  { id: '1', first_name: 'Jordan', last_name: 'Lee', email: 'jordan@acme.com', role: 'Admin' },
  { id: '2', first_name: 'Sam', last_name: 'Patel', email: 'sam@acme.com', role: 'Member' },
  { id: '3', first_name: 'Casey', last_name: 'Kim', email: 'casey@acme.com', role: 'Member' },
];

const MOCK_SEARCH_FIELDS: readonly SearchFieldConfig[] = [
  { value: 'name', label: 'Name', type: 'string' },
];

const COLUMNS: readonly DataTableColumn<MockUser>[] = [
  { key: 'name', header: 'Name', render: (user) => `${user.first_name} ${user.last_name}` },
  { key: 'email', header: 'Email', render: (user) => user.email },
  { key: 'role', header: 'Role', render: (user) => user.role },
];

const UserPickerDemo = () => {
  const [value, setValue] = React.useState<string | undefined>(undefined);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const filtered = MOCK_USERS.filter((user) =>
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(search.toLowerCase())
  );
  const selected = MOCK_USERS.find((user) => user.id === value);

  return (
    <div className="w-full max-w-sm">
      <Button
        type="button"
        variant="outlined"
        role="combobox"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="w-full justify-between font-normal"
      >
        {selected ? `${selected.first_name} ${selected.last_name} (${selected.email})` : 'Select a user…'}
        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select a User</DialogTitle>
            <DialogDescription>Preview uses mock data — the live component fetches from the Users API.</DialogDescription>
          </DialogHeader>

          <SearchFilterBar
            fields={MOCK_SEARCH_FIELDS}
            field="name"
            value={search}
            onFieldChange={() => undefined}
            onValueChange={setSearch}
          />

          <DataTable
            columns={COLUMNS}
            rows={filtered}
            getRowId={(user) => user.id}
            isLoading={false}
            currentPage={1}
            totalPages={1}
            onPageChange={() => undefined}
            emptyMessage="No users found"
            renderRowActions={(user) => (
              <Button
                type="button"
                size="sm"
                variant={value === user.id ? 'solid' : 'outlined'}
                onClick={() => {
                  setValue(user.id);
                  setOpen(false);
                }}
              >
                {value === user.id ? 'Selected' : 'Select'}
              </Button>
            )}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const USER_PICKER_DOC: CompositeDoc = {
  overview: (
    <>
      UserPicker is a trigger + modal picker for selecting a user by GUID: opening it reveals a
      searchable, paginated DataTable of users, mirroring the same SearchFilterBar + DataTable pairing
      the CMS user management page itself uses — rather than eagerly loading every user up front the way
      a plain Combobox would. Enterprise use cases: assigning an owner, reviewer, or approver field on
      any entity form.
    </>
  ),
  importStatement: "import { UserPicker } from '@inithium/ui';",
  composition: [
    { name: 'Button', role: 'The combobox-styled trigger, showing the selected user\'s name and email once chosen.' },
    { name: 'Dialog', role: 'Hosts the search + table UI.' },
    { name: 'SearchFilterBar', role: 'Filters by first name, last name, email, or role.' },
    { name: 'DataTable', role: 'Paginated user list with a per-row Select action — the same composite documented on its own page.' },
    { name: 'useUserPicker', role: 'Internal hook pairing useReadAllUsersQuery with useEntityListState; useReadUserQuery separately resolves the selected id into a display label.' },
  ],
  propGroups: [
    {
      component: 'UserPicker',
      props: [
        { name: 'value', type: 'string', description: "Selected user's GUID." },
        { name: 'onChange', type: '(userId: string) => void', required: true, description: 'Called with the selected user\'s id.' },
        { name: 'placeholder', type: 'string', defaultValue: "'Select a user…'", description: 'Trigger text shown when nothing is selected.' },
        { name: 'error', type: 'boolean | string', description: 'Marks the trigger invalid and switches it to the destructive palette.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the trigger.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Owner picker (mocked)',
      description: 'This preview recreates UserPicker\'s dialog from the real DataTable/SearchFilterBar composites wired to a local mock array, so the documentation page never depends on live backend state.',
      code: `<UserPicker value={ownerId} onChange={setOwnerId} placeholder="Select an owner…" />`,
      preview: <UserPickerDemo />,
    },
  ],
};

export const UserPickerDoc = () => <CompositeDocView doc={USER_PICKER_DOC} />;
