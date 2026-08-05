import * as React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '../../primitives/button.js';
import { cn } from '../../utils/cn.js';
import type { AutoIncrementListProps } from './auto-increment-list.types.js';

interface UncontrolledRow {
  id: number;
}

const DEFAULT_ROW_CONTENT_CLASS_NAME = 'min-w-0 flex-1';

/**
 * Vertical row list with add/remove affordances: the last row always shows only an increment
 * ("+") button, every row above it shows only a decrement ("-") button, and remove buttons are
 * always styled `destructive` (red) so add/remove read apart from each other at a glance. Two
 * modes:
 *
 * - Uncontrolled (`item` only, the original API): the list owns its own row count internally —
 *   `item` is the same node re-rendered per row, each mounting its own independent state, with no
 *   way for the caller to read the rows' contents back out.
 * - Controlled (`values`/`onValuesChange`/`createItem`/`renderItem`): the caller owns the row data
 *   as a plain array and this component only renders it and reports add/remove/edit back up —
 *   needed for anything (like a nested/recursive value editor) whose rows carry real state the
 *   caller must read, and whose row identity must stay stable independent of row position (via
 *   `getRowKey`), since re-keying by index would remount every row after an edit or removal.
 *
 * Each row uses `items-start` rather than centering, and the +/- button sits right after that
 * row's own content (see `getRowContentClassName`) rather than always being stretched to the
 * list's far edge — both matter once rows can be taller than one line (e.g. a "key + type" header
 * with an indented nested list below it): centering/stretching would otherwise land the button
 * somewhere in the middle of unrelated content instead of beside the row it actually acts on.
 */
export function AutoIncrementList<T = unknown>({
  item,
  values,
  onValuesChange,
  createItem,
  renderItem,
  getRowKey,
  getRowContentClassName,
  className,
  rowClassName
}: AutoIncrementListProps<T>): React.ReactElement {
  const nextRowId = React.useRef(0);
  const createRow = React.useCallback((): UncontrolledRow => ({ id: nextRowId.current++ }), []);
  const [uncontrolledRows, setUncontrolledRows] = React.useState<UncontrolledRow[]>(() => [createRow()]);

  const handleIncrement = React.useCallback(() => {
    setUncontrolledRows((prevRows) => [...prevRows, createRow()]);
  }, [createRow]);

  const handleDecrement = React.useCallback((id: number) => {
    setUncontrolledRows((prevRows) => prevRows.filter((row) => row.id !== id));
  }, []);

  const isControlled =
    values !== undefined && onValuesChange !== undefined && createItem !== undefined && renderItem !== undefined;

  if (isControlled) {
    const list = values;
    const onListChange = onValuesChange;
    const buildItem = createItem;
    const renderRow = renderItem;

    return (
      <div data-slot="auto-increment-list" className={cn('flex flex-col gap-2', className)}>
        {list.map((value, index) => {
          const isLastRow = index === list.length - 1;
          const key = getRowKey ? getRowKey(value, index) : index;
          const contentClassName = getRowContentClassName
            ? getRowContentClassName(value, index)
            : DEFAULT_ROW_CONTENT_CLASS_NAME;

          return (
            <div key={key} data-slot="auto-increment-list-row" className={cn('flex items-start justify-between gap-2', rowClassName)}>
              <div className={contentClassName}>
                {renderRow({
                  value,
                  index,
                  isLastRow,
                  onChange: (nextValue) => {
                    const next = list.slice();
                    next[index] = nextValue;
                    onListChange(next);
                  }
                })}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {isLastRow ? (
                  <Button
                    type="button"
                    size="icon"
                    aria-label="Add row"
                    onClick={() => onListChange([...list, buildItem()])}
                  >
                    <Plus className="size-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    aria-label="Remove row"
                    onClick={() => onListChange(list.filter((_, i) => i !== index))}
                  >
                    <Minus className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
        {list.length === 0 ? (
          <div className="flex justify-end">
            <Button type="button" size="icon" aria-label="Add row" onClick={() => onListChange([buildItem()])}>
              <Plus className="size-4" />
            </Button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div data-slot="auto-increment-list" className={cn('flex flex-col gap-2', className)}>
      {uncontrolledRows.map((row, index) => {
        const isLastRow = index === uncontrolledRows.length - 1;

        return (
          <div
            key={row.id}
            data-slot="auto-increment-list-row"
            className={cn('flex items-start gap-2', rowClassName)}
          >
            <div className={DEFAULT_ROW_CONTENT_CLASS_NAME}>{item}</div>
            <div className="flex shrink-0 items-center gap-1">
              {isLastRow ? (
                <Button
                  type="button"
                  size="icon"
                  aria-label="Add row"
                  onClick={handleIncrement}
                >
                  <Plus className="size-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  aria-label="Remove row"
                  onClick={() => handleDecrement(row.id)}
                >
                  <Minus className="size-4" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
