import * as React from 'react';
import type { AssetCategory, AssetWithUrl } from '@inithium/models';
import type { InputProps } from '../../primitives/input.js';
import type { SearchFieldConfig } from '../SearchFilterBar/search-filter-bar.types.js';

export interface UseAssetPickerOptions {
  /** Scopes the browsable library to this user GUID's own uploads. Omit to browse system assets plus every user's uploads. */
  readonly user?: string;
  readonly pageLimit?: number;
  /**
   * Locks the picker to a single asset category (e.g. `'images'`). When set, the "Type" search
   * field is hidden — there's nothing to filter by when only one type is selectable — and results
   * are restricted to that category regardless of what the caller searches for.
   */
  readonly assetCategory?: AssetCategory;
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
  /** Locks the picker to a single asset category (e.g. `'images'`), hiding the Type filter. */
  readonly assetCategory?: AssetCategory;
  readonly dialogTitle?: React.ReactNode;
  readonly dialogDescription?: React.ReactNode;
  readonly emptyMessage?: React.ReactNode;
  readonly triggerOnFocus?: boolean;
}