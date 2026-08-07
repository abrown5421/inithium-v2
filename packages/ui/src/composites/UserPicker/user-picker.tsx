import * as React from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { useReadUserQuery } from '@inithium/store';
import { Button } from '../../primitives/button.js';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../primitives/dialog.js';
import { cn } from '../../utils/cn.js';
import { SearchFilterBar } from '../SearchFilterBar/search-filter-bar.js';
import { DataTable } from '../DataTable/data-table.js';
import type { DataTableColumn } from '../DataTable/data-table.types.js';
import { formatRole, useUserPicker } from './use-user-picker.js';
import type { PickableUser, UserPickerProps } from './user-picker.types.js';

const formatUserLabel = (user: Pick<PickableUser, 'first_name' | 'last_name' | 'email'>): string =>
  `${user.first_name} ${user.last_name} (${user.email})`;

const COLUMNS: readonly DataTableColumn<PickableUser>[] = [
  { key: 'name', header: 'Name', render: (user) => `${user.first_name} ${user.last_name}` },
  { key: 'email', header: 'Email', render: (user) => user.email },
  { key: 'role', header: 'Role', render: (user) => formatRole(user.role) }
];

/**
 * Trigger + modal picker for selecting a user by GUID: opens a searchable, paginated table of
 * users (mirroring the CMS user management page's own `SearchFilterBar` + `DataTable` pairing)
 * rather than eagerly loading every user up front like the `Combobox` this replaces did.
 */
export const UserPicker: React.FC<UserPickerProps> = ({
  value,
  onChange,
  placeholder = 'Select a user…',
  error,
  disabled = false
}) => {
  const [open, setOpen] = React.useState(false);
  const picker = useUserPicker();
  const { data: selectedUser } = useReadUserQuery(value ?? '', { skip: !value });

  const selectUser = (userId: string): void => {
    onChange(userId);
    setOpen(false);
  };

  const triggerLabel = selectedUser ? formatUserLabel(selectedUser) : placeholder;

  return (
    <>
      <Button
        type="button"
        variant="outlined"
        role="combobox"
        aria-expanded={open}
        aria-invalid={Boolean(error)}
        disabled={disabled}
        onClick={() => setOpen(true)}
        className={cn(
          'w-full justify-between font-normal',
          !selectedUser && 'text-muted-foreground',
          'aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20'
        )}
      >
        {triggerLabel}
        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select a User</DialogTitle>
            <DialogDescription>Search and choose a user.</DialogDescription>
          </DialogHeader>

          <SearchFilterBar
            fields={picker.searchableFields}
            field={picker.searchField}
            value={picker.searchValue}
            onFieldChange={picker.handleSearchFieldChange}
            onValueChange={picker.handleSearchValueChange}
          />

          <DataTable
            columns={COLUMNS}
            rows={picker.users}
            getRowId={(user) => user._id}
            getRowLabel={(user) => `${user.first_name} ${user.last_name}`}
            isLoading={picker.isLoading}
            isFetching={picker.isFetching}
            currentPage={picker.currentPage}
            totalPages={picker.totalPages}
            onPageChange={picker.handlePageChange}
            emptyMessage="No users found"
            renderRowActions={(user) => (
              <Button
                type="button"
                size="sm"
                variant={value === user._id ? 'solid' : 'outlined'}
                onClick={() => selectUser(user._id)}
              >
                {value === user._id ? 'Selected' : 'Select'}
              </Button>
            )}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

UserPicker.displayName = 'UserPicker';
