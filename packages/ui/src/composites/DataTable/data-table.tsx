import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../primitives/table.js';
import { Checkbox } from '../../primitives/checkbox.js';
import { Spinner } from '../../primitives/spinner.js';
import { PaginationControl } from '../Pagination/pagination-control.js';
import type { DataTableProps } from './data-table.types.js';

/**
 * Paginated, optionally-selectable table: loading state, a checkbox column with select-all/
 * indeterminate header state, arbitrary data columns, an optional row-actions column, and a
 * centered pagination footer (with a small spinner alongside it for background refetches).
 * Entity-agnostic — permission gating (whether `selectable`/`renderRowActions` are even passed)
 * is the caller's responsibility.
 */
export function DataTable<TRow>({
  columns,
  rows,
  getRowId,
  isLoading,
  isFetching = false,
  currentPage,
  totalPages,
  onPageChange,
  selectable = false,
  selectedIds,
  onToggleRow,
  onToggleAllOnPage,
  getRowLabel,
  selectAllLabel = 'Select all rows on this page',
  renderRowActions,
  emptyMessage = 'No records found'
}: DataTableProps<TRow>): React.ReactElement {
  const allOnPageSelected = selectable && rows.length > 0 && rows.every((row) => selectedIds?.has(getRowId(row)));
  const someOnPageSelected = selectable && rows.some((row) => selectedIds?.has(getRowId(row)));
  const columnCount = columns.length + (selectable ? 1 : 0) + (renderRowActions ? 1 : 0);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            {selectable ? (
              <TableHead className="w-10">
                <Checkbox
                  checked={allOnPageSelected ? true : someOnPageSelected ? 'indeterminate' : false}
                  onCheckedChange={(checked) => onToggleAllOnPage?.(checked === true)}
                  aria-label={selectAllLabel}
                />
              </TableHead>
            ) : null}
            {columns.map((column) => (
              <TableHead key={column.key} className={column.align === 'right' ? 'text-right' : undefined}>
                {column.header}
              </TableHead>
            ))}
            {renderRowActions ? <TableHead className="text-right">Actions</TableHead> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columnCount} className="text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => {
              const id = getRowId(row);
              const label = getRowLabel?.(row) ?? id;
              return (
                <TableRow key={id}>
                  {selectable ? (
                    <TableCell>
                      <Checkbox
                        checked={selectedIds?.has(id) ?? false}
                        onCheckedChange={(checked) => onToggleRow?.(id, checked === true)}
                        aria-label={`Select ${label}`}
                      />
                    </TableCell>
                  ) : null}
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.align === 'right' ? 'text-right' : undefined}>
                      {column.render(row)}
                    </TableCell>
                  ))}
                  {renderRowActions ? (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">{renderRowActions(row)}</div>
                    </TableCell>
                  ) : null}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <span />
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          className="justify-self-center"
        />
        <div className="justify-self-end">{isFetching ? <Spinner size="sm" /> : null}</div>
      </div>
    </div>
  );
}
