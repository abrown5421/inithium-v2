import * as React from 'react';
import { z } from 'zod';
import { Pencil, Trash2 } from 'lucide-react';
import { PageLayoutComponent, useCrudFormState } from '@inithium/pages';
import {
  USER_ROLES,
  canAssignUserRole,
  canPerformUserAction,
  getAssignableUserRoles,
  getEditableUserFields
} from '@inithium/types';
import type { SanitizedUser } from '@inithium/services';
import { createUserSchema, updateUserSchema } from '@inithium/validators';
import {
  openAlert,
  selectCurrentUser,
  useAppDispatch,
  useAppSelector,
  useCreateUserMutation,
  useDeleteUserMutation,
  useDeleteUsersMutation,
  useReadAllUsersQuery,
  useUpdateUserMutation
} from '@inithium/store';
import {
  Button,
  ConfirmDeleteDialog,
  DataTable,
  type DataTableColumn,
  EntityFormDialog,
  type FormFieldConfig,
  Heading,
  type SearchFieldConfig,
  SearchFilterBar,
  useEntityListState
} from '@inithium/ui';
import { UserFormValues } from './user-management-page.types.js';

const SUBMISSION_ERROR_MESSAGE = 'There was a problem with your submission';
const DELETE_ERROR_MESSAGE = 'There was a problem deleting the selected user(s)';
const PAGE_LIMIT = 10;

const EMPTY_USER_FORM_VALUES: UserFormValues = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  role: 'user'
};

const formatRole = (role: string): string =>
  role
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

/** Add a new searchable User field here — the field-select and value widget both follow from `type`. */
const SEARCHABLE_FIELDS: readonly SearchFieldConfig[] = [
  { value: 'first_name', label: 'First Name', type: 'string' },
  { value: 'last_name', label: 'Last Name', type: 'string' },
  { value: 'email', label: 'Email', type: 'string' },
  {
    value: 'role',
    label: 'Role',
    type: 'enum',
    options: USER_ROLES.map((option) => ({ value: option, label: formatRole(option) }))
  }
];

const USER_COLUMNS: readonly DataTableColumn<SanitizedUser>[] = [
  { key: 'name', header: 'Name', render: (user) => `${user.first_name} ${user.last_name}` },
  { key: 'email', header: 'Email', render: (user) => user.email },
  { key: 'role', header: 'Role', render: (user) => formatRole(user.role) }
];

export const UserManagementPage: PageLayoutComponent = () => {
  const dispatch = useAppDispatch();
  const actingRole = useAppSelector(selectCurrentUser)?.role ?? 'user';
  const canCreate = canPerformUserAction(actingRole, 'create');
  const canDelete = canPerformUserAction(actingRole, 'delete');
  const canEditRoleField = getEditableUserFields(actingRole).includes('role');
  const assignableRoles = getAssignableUserRoles(actingRole);

  const listState = useEntityListState(SEARCHABLE_FIELDS[0].value);
  const activeSearchField =
    SEARCHABLE_FIELDS.find((option) => option.value === listState.searchField) ?? SEARCHABLE_FIELDS[0];
  const { data, isLoading, isFetching } = useReadAllUsersQuery({
    page: listState.currentPage,
    limit: PAGE_LIMIT,
    field: listState.searchField,
    search: listState.searchValue,
    fieldType: activeSearchField.type
  });
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeletingOne }] = useDeleteUserMutation();
  const [deleteUsers, { isLoading: isDeletingMany }] = useDeleteUsersMutation();
  const isDeleting = isDeletingOne || isDeletingMany;

  const formState = useCrudFormState<UserFormValues>(EMPTY_USER_FORM_VALUES);
  const [selectedUser, setSelectedUser] = React.useState<SanitizedUser | null>(null);
  const [usersPendingDelete, setUsersPendingDelete] = React.useState<readonly SanitizedUser[]>([]);

  const users = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  /**
   * Options for the role field in the create/edit form. Restricted to what `actingRole` may
   * assign. When editing a user whose current role is above that cap, it's injected as a
   * disabled option so the field still displays the true value instead of appearing blank —
   * the acting role can demote away from it but can't re-select back into it.
   */
  const roleFieldOptions = React.useMemo(() => {
    const base = assignableRoles.map((value) => ({ value, label: formatRole(value), disabled: false }));
    if (formState.mode === 'edit' && selectedUser && !canAssignUserRole(actingRole, selectedUser.role)) {
      return [{ value: selectedUser.role, label: formatRole(selectedUser.role), disabled: true }, ...base];
    }
    return base;
  }, [actingRole, assignableRoles, formState.mode, selectedUser]);

  const formFields: readonly FormFieldConfig[] = [
    { key: 'first_name', label: 'First Name', type: 'text', required: true },
    { key: 'last_name', label: 'Last Name', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    {
      key: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      autoComplete: 'new-password',
      visible: formState.mode === 'create'
    },
    { key: 'role', label: 'Role', type: 'select', required: true, options: roleFieldOptions, visible: canEditRoleField }
  ];

  const openCreateModal = () => {
    setSelectedUser(null);
    formState.openCreate(EMPTY_USER_FORM_VALUES);
  };

  const openEditModal = (user: SanitizedUser) => {
    setSelectedUser(user);
    formState.openEdit({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: '',
      role: user.role
    });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = formState.values;

    if (formState.mode === 'create') {
      const result = createUserSchema.safeParse({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
        role: values.role
      });

      if (!result.success) {
        const { fieldErrors } = z.flattenError(result.error);
        formState.setErrors({
          first_name: fieldErrors.first_name?.[0],
          last_name: fieldErrors.last_name?.[0],
          email: fieldErrors.email?.[0],
          password: fieldErrors.password?.[0],
          role: fieldErrors.role?.[0]
        });
        return;
      }

      formState.setErrors({});
      try {
        await createUser(result.data).unwrap();
        dispatch(openAlert({ severity: 'success', message: 'User created' }));
        formState.close();
      } catch {
        dispatch(openAlert({ severity: 'destructive', message: SUBMISSION_ERROR_MESSAGE }));
      }
      return;
    }

    if (!selectedUser) return;

    const roleChanged = canEditRoleField && values.role !== selectedUser.role;
    const result = updateUserSchema.safeParse({
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      ...(roleChanged ? { role: values.role } : {})
    });
    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      formState.setErrors({
        first_name: fieldErrors.first_name?.[0],
        last_name: fieldErrors.last_name?.[0],
        email: fieldErrors.email?.[0],
        role: fieldErrors.role?.[0]
      });
      return;
    }

    formState.setErrors({});
    try {
      await updateUser({ id: selectedUser._id, data: result.data }).unwrap();
      dispatch(openAlert({ severity: 'success', message: 'User updated' }));
      formState.close();
    } catch {
      dispatch(openAlert({ severity: 'destructive', message: SUBMISSION_ERROR_MESSAGE }));
    }
  };

  const openDeleteDialog = (user: SanitizedUser) => setUsersPendingDelete([user]);

  const openBulkDeleteDialog = () =>
    setUsersPendingDelete(users.filter((user) => listState.selectedIds.has(user._id)));

  const handleConfirmDelete = async () => {
    if (usersPendingDelete.length === 0) return;
    try {
      if (usersPendingDelete.length === 1) {
        await deleteUser(usersPendingDelete[0]._id).unwrap();
      } else {
        await deleteUsers(usersPendingDelete.map((user) => user._id)).unwrap();
      }
      dispatch(
        openAlert({
          severity: 'success',
          message: usersPendingDelete.length === 1 ? 'User deleted' : `${usersPendingDelete.length} users deleted`
        })
      );
      listState.removeFromSelection(usersPendingDelete.map((user) => user._id));
      setUsersPendingDelete([]);
    } catch {
      dispatch(openAlert({ severity: 'destructive', message: DELETE_ERROR_MESSAGE }));
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <Heading font='secondary' level={1}>Users</Heading>
        <div className="flex items-center gap-2">
          {canDelete && listState.selectedIds.size > 1 ? (
            <Button type="button" onClick={openBulkDeleteDialog}>
              Delete Selected ({listState.selectedIds.size})
            </Button>
          ) : null}
          {canCreate ? (
            <Button type="button" onClick={openCreateModal}>
              Create New User
            </Button>
          ) : null}
        </div>
      </div>

      <SearchFilterBar
        fields={SEARCHABLE_FIELDS}
        field={listState.searchField}
        value={listState.searchValue}
        onFieldChange={listState.handleSearchFieldChange}
        onValueChange={listState.handleSearchValueChange}
      />

      <DataTable
        columns={USER_COLUMNS}
        rows={users}
        getRowId={(user) => user._id}
        getRowLabel={(user) => `${user.first_name} ${user.last_name}`}
        selectAllLabel="Select all users on this page"
        isLoading={isLoading}
        isFetching={isFetching}
        currentPage={listState.currentPage}
        totalPages={totalPages}
        onPageChange={listState.handlePageChange}
        selectable={canDelete}
        selectedIds={listState.selectedIds}
        onToggleRow={listState.toggleSelected}
        onToggleAllOnPage={(checked) =>
          listState.toggleSelectAllOnPage(
            checked,
            users.map((user) => user._id)
          )
        }
        renderRowActions={(user) => (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Edit ${user.first_name} ${user.last_name}`}
              onClick={() => openEditModal(user)}
            >
              <Pencil className="size-4" />
            </Button>
            {canDelete ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Delete ${user.first_name} ${user.last_name}`}
                onClick={() => openDeleteDialog(user)}
              >
                <Trash2 className="size-4" />
              </Button>
            ) : null}
          </>
        )}
      />

      <EntityFormDialog
        open={formState.isOpen}
        onOpenChange={(open) => {
          if (!open) formState.close();
        }}
        title={formState.mode === 'create' ? 'Create New User' : 'Edit User'}
        fields={formFields}
        values={formState.values}
        errors={formState.errors}
        onChange={formState.setValue}
        onSubmit={handleFormSubmit}
        onCancel={formState.close}
        isSubmitting={isCreating || isUpdating}
        submitLabel={formState.mode === 'create' ? 'Create' : 'Save'}
      />

      <ConfirmDeleteDialog
        open={usersPendingDelete.length > 0}
        onOpenChange={(open) => {
          if (!open) setUsersPendingDelete([]);
        }}
        title={usersPendingDelete.length === 1 ? 'Delete User' : 'Delete Users'}
        description={
          <>
            {usersPendingDelete.length === 1
              ? `This will permanently delete ${usersPendingDelete[0]?.first_name} ${usersPendingDelete[0]?.last_name}. `
              : usersPendingDelete.length > 1
                ? `This will permanently delete ${usersPendingDelete.length} users. `
                : ''}
            This action cannot be undone.
          </>
        }
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};
