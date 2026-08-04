import * as React from 'react';
import type { AssetWithUrl } from '@inithium/models';
import type { InputProps } from '../../primitives/input.js';
import type { SearchFieldConfig } from '../SearchFilterBar/search-filter-bar.types.js';

export interface UseAssetPickerOptions {
  /** Scopes the browsable library to this user GUID's own uploads. Omit to browse system assets plus every user's uploads. */
  readonly user?: string;
  readonly pageLimit?: number;
}

export interface AssetPickerState {
  readonly assets: readonly AssetWithUrl[];
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

export interface AssetPickerProps extends Omit<InputProps, 'onChange'> {
  readonly value?: string;
  readonly onValueChange?: (value: string) => void;
  /** Scopes the browsable library to this user GUID's own uploads. Omit to browse system assets plus every user's uploads. */
  readonly user?: string;
  /** Assets fetched per page. Defaults to 10, matching the CMS asset management page. */
  readonly pageLimit?: number;
  readonly dialogTitle?: React.ReactNode;
  readonly dialogDescription?: React.ReactNode;
  readonly emptyMessage?: React.ReactNode;
  readonly triggerOnFocus?: boolean;
}
