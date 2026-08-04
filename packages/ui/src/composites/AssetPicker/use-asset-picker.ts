import * as React from 'react';
import { ASSET_CATEGORIES, type AssetCategory, type AssetWithUrl } from '@inithium/models';
import { useReadAllAssetsQuery } from '@inithium/store';
import { useEntityListState } from '../../hooks/use-entity-list-state.js';
import type { SearchFieldConfig } from '../SearchFilterBar/search-filter-bar.types.js';
import type { AssetPickerState, UseAssetPickerOptions } from './asset-picker.types.js';

const DEFAULT_PAGE_LIMIT = 10;

export const ASSET_CATEGORY_LABELS: Record<AssetCategory, string> = {
  images: 'Images',
  pdfs: 'PDFs',
  videos: 'Videos',
  audio: 'Audio',
  fonts: 'Fonts',
  archives: 'Archives',
  data: 'Data',
  other: 'Other'
};

/** Mirrors the searchable-field contract used by the CMS asset management page's `SearchFilterBar`. */
export const ASSET_PICKER_SEARCHABLE_FIELDS: readonly SearchFieldConfig[] = [
  { value: 'originalName', label: 'Name', type: 'string' },
  { value: 'isSystem', label: 'System Asset', type: 'boolean' },
  {
    value: 'category',
    label: 'Type',
    type: 'enum',
    options: ASSET_CATEGORIES.map((category) => ({ value: category, label: ASSET_CATEGORY_LABELS[category] }))
  }
];

/**
 * System assets have no owning user (`uploadedBy: 'system'`), so a user-scoped picker can never
 * contain one — the "System Asset" filter would always be a no-op or an empty result there, so
 * it's dropped from the field list entirely once `user` is set.
 */
const getSearchableFields = (user: string | undefined): readonly SearchFieldConfig[] =>
  user ? ASSET_PICKER_SEARCHABLE_FIELDS.filter((field) => field.value !== 'isSystem') : ASSET_PICKER_SEARCHABLE_FIELDS;

/**
 * `uploadedBy` isn't one of the assets endpoint's server-side searchable fields (only
 * originalName/isSystem/category are — see `asset.router.ts`), so scoping the picker to one
 * user's uploads has to happen client-side over the fetched page rather than as a query param.
 */
const scopeAssetsToOwner = (assets: readonly AssetWithUrl[], user: string | undefined): readonly AssetWithUrl[] =>
  user ? assets.filter((asset) => asset.uploadedBy === user) : assets;

/**
 * Owns asset-picker data fetching, search/type filtering, and pagination state, independent of
 * how the results get presented. Built on the same `useEntityListState` + `useReadAllAssetsQuery`
 * pairing as the CMS asset management page, so paging/search behave identically.
 */
export const useAssetPicker = ({ user, pageLimit = DEFAULT_PAGE_LIMIT }: UseAssetPickerOptions): AssetPickerState => {
  const searchableFields = React.useMemo(() => getSearchableFields(user), [user]);

  const listState = useEntityListState(searchableFields[0].value);
  const activeSearchField =
    searchableFields.find((option) => option.value === listState.searchField) ?? searchableFields[0];

  const { data, isLoading, isFetching } = useReadAllAssetsQuery({
    page: listState.currentPage,
    limit: pageLimit,
    field: listState.searchField,
    search: listState.searchValue,
    fieldType: activeSearchField.type
  });

  const assets = React.useMemo(() => scopeAssetsToOwner(data?.data ?? [], user), [data, user]);

  return {
    assets,
    isLoading,
    isFetching,
    currentPage: listState.currentPage,
    totalPages: data?.totalPages ?? 1,
    searchField: listState.searchField,
    searchValue: listState.searchValue,
    searchableFields,
    handlePageChange: listState.handlePageChange,
    handleSearchFieldChange: listState.handleSearchFieldChange,
    handleSearchValueChange: listState.handleSearchValueChange
  };
};
