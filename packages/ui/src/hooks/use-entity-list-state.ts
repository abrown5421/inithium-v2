import * as React from 'react';

export interface EntityListState {
  readonly currentPage: number;
  readonly searchField: string;
  readonly searchValue: string;
  readonly selectedIds: ReadonlySet<string>;
  readonly handlePageChange: (page: number) => void;
  readonly handleSearchFieldChange: (field: string) => void;
  readonly handleSearchValueChange: (value: string) => void;
  readonly toggleSelected: (id: string, checked: boolean) => void;
  readonly toggleSelectAllOnPage: (checked: boolean, idsOnPage: readonly string[]) => void;
  readonly removeFromSelection: (ids: readonly string[]) => void;
  readonly clearSelection: () => void;
}

/**
 * Pagination + search + row-selection interaction state shared by any list page or picker (built
 * out of `user-management-page.tsx`'s hand-written state). Changing the search field or value
 * resets to page 1 and clears selection, since the visible row set is about to change underneath
 * it. Doesn't own the actual data fetch — the caller still calls its own entity-specific
 * `useReadAllXQuery` with `{ page: currentPage, field: searchField, search: searchValue }`.
 */
export const useEntityListState = (defaultSearchField: string): EntityListState => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchField, setSearchField] = React.useState(defaultSearchField);
  const [searchValue, setSearchValue] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState<ReadonlySet<string>>(new Set());

  const handlePageChange = React.useCallback((nextPage: number) => {
    setSelectedIds(new Set());
    setCurrentPage(nextPage);
  }, []);

  const handleSearchFieldChange = React.useCallback((field: string) => {
    setSearchField(field);
    setSearchValue('');
    setCurrentPage(1);
    setSelectedIds(new Set());
  }, []);

  const handleSearchValueChange = React.useCallback((value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
    setSelectedIds(new Set());
  }, []);

  const toggleSelected = React.useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  const toggleSelectAllOnPage = React.useCallback((checked: boolean, idsOnPage: readonly string[]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      idsOnPage.forEach((id) => (checked ? next.add(id) : next.delete(id)));
      return next;
    });
  }, []);

  const removeFromSelection = React.useCallback((ids: readonly string[]) => {
    setSelectedIds((prev) => {
      const toRemove = new Set(ids);
      return new Set([...prev].filter((id) => !toRemove.has(id)));
    });
  }, []);

  const clearSelection = React.useCallback(() => setSelectedIds(new Set()), []);

  return {
    currentPage,
    searchField,
    searchValue,
    selectedIds,
    handlePageChange,
    handleSearchFieldChange,
    handleSearchValueChange,
    toggleSelected,
    toggleSelectAllOnPage,
    removeFromSelection,
    clearSelection
  };
};
