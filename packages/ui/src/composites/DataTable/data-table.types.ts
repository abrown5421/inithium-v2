import * as React from 'react';

export interface DataTableColumn<TRow> {
  readonly key: string;
  readonly header: React.ReactNode;
  readonly render: (row: TRow) => React.ReactNode;
  readonly align?: 'left' | 'right';
}

export interface DataTableProps<TRow> {
  readonly columns: readonly DataTableColumn<TRow>[];
  readonly rows: readonly TRow[];
  readonly getRowId: (row: TRow) => string;
  readonly isLoading: boolean;
  /** Shows a small spinner beside the pagination control without replacing the table (e.g. a background refetch). */
  readonly isFetching?: boolean;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
  /** Adds a checkbox column with select-all/indeterminate header state. Omit entirely when the caller has no bulk action for the selection. */
  readonly selectable?: boolean;
  readonly selectedIds?: ReadonlySet<string>;
  readonly onToggleRow?: (id: string, checked: boolean) => void;
  readonly onToggleAllOnPage?: (checked: boolean) => void;
  /** Human-readable label per row, used for the row checkbox's `aria-label`. Falls back to the row id. */
  readonly getRowLabel?: (row: TRow) => string;
  readonly selectAllLabel?: string;
  /** Renders an actions column (e.g. edit/delete icon buttons) for each row. Omitted entirely when not provided. */
  readonly renderRowActions?: (row: TRow) => React.ReactNode;
  readonly emptyMessage?: React.ReactNode;
}
