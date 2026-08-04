import type { User } from '@inithium/models';
import type { SearchFieldConfig } from '../SearchFilterBar/search-filter-bar.types.js';

/** A user with its password field stripped — matches the shape the users API actually returns (`SanitizedUser` in `@inithium/services`). */
export type PickableUser = Omit<User, 'password'>;

export interface UserPickerState {
  readonly users: readonly PickableUser[];
  readonly isLoading: boolean;
  readonly isFetching: boolean;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly searchField: string;
  readonly searchValue: string;
  readonly searchableFields: readonly SearchFieldConfig[];
  readonly handlePageChange: (page: number) => void;
  readonly handleSearchFieldChange: (field: string) => void;
  readonly handleSearchValueChange: (value: string) => void;
}

export interface UserPickerProps {
  /** Selected user's GUID. */
  readonly value?: string;
  readonly onChange: (userId: string) => void;
  readonly placeholder?: string;
  readonly error?: boolean | string;
  readonly disabled?: boolean;
}
