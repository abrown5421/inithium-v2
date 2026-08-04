import { USER_ROLES } from '@inithium/types';
import { useReadAllUsersQuery } from '@inithium/store';
import { useEntityListState } from '../../hooks/use-entity-list-state.js';
import type { SearchFieldConfig } from '../SearchFilterBar/search-filter-bar.types.js';
import type { UserPickerState } from './user-picker.types.js';

const PAGE_LIMIT = 10;

/** Title-cases a hyphenated role slug, e.g. `super-admin` -> `Super Admin`. */
export const formatRole = (role: string): string =>
  role
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

/** Mirrors the searchable-field contract used by the CMS user management page's `SearchFilterBar`. */
export const USER_PICKER_SEARCHABLE_FIELDS: readonly SearchFieldConfig[] = [
  { value: 'first_name', label: 'First Name', type: 'string' },
  { value: 'last_name', label: 'Last Name', type: 'string' },
  { value: 'email', label: 'Email', type: 'string' },
  {
    value: 'role',
    label: 'Role',
    type: 'enum',
    options: USER_ROLES.map((role) => ({ value: role, label: formatRole(role) }))
  }
];

/**
 * Owns user-picker data fetching, search filtering, and pagination state, independent of how the
 * results get presented. Built on the same `useEntityListState` + `useReadAllUsersQuery` pairing
 * as the CMS user management page, so paging/search behave identically.
 */
export const useUserPicker = (): UserPickerState => {
  const listState = useEntityListState(USER_PICKER_SEARCHABLE_FIELDS[0].value);
  const activeSearchField =
    USER_PICKER_SEARCHABLE_FIELDS.find((option) => option.value === listState.searchField) ??
    USER_PICKER_SEARCHABLE_FIELDS[0];

  const { data, isLoading, isFetching } = useReadAllUsersQuery({
    page: listState.currentPage,
    limit: PAGE_LIMIT,
    field: listState.searchField,
    search: listState.searchValue,
    fieldType: activeSearchField.type
  });

  return {
    users: data?.data ?? [],
    isLoading,
    isFetching,
    currentPage: listState.currentPage,
    totalPages: data?.totalPages ?? 1,
    searchField: listState.searchField,
    searchValue: listState.searchValue,
    searchableFields: USER_PICKER_SEARCHABLE_FIELDS,
    handlePageChange: listState.handlePageChange,
    handleSearchFieldChange: listState.handleSearchFieldChange,
    handleSearchValueChange: listState.handleSearchValueChange
  };
};
