import * as React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '../../primitives/button.js';
import { cn } from '../../utils/cn.js';
import type { AutoIncrementListProps } from './auto-increment-list.types.js';

interface UncontrolledRow {
  id: number;
}

const DEFAULT_ROW_CONTENT_CLASS_NAME = 'min-w-0 flex-1';

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
                {isLastRow && (
                  <Button
                    type="button"
                    size="icon"
                    aria-label="Add row"
                    onClick={() => onListChange([...list, buildItem()])}
                  >
                    <Plus className="size-4" />
                  </Button>
                )}
                <Button
                  type="button"
                  color="destructive"
                  size="icon"
                  aria-label="Remove row"
                  onClick={() => onListChange(list.filter((_, i) => i !== index))}
                >
                  <Minus className="size-4" />
                </Button>
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
              {isLastRow && (
                <Button
                  type="button"
                  size="icon"
                  aria-label="Add row"
                  onClick={handleIncrement}
                >
                  <Plus className="size-4" />
                </Button>
              )}
              <Button
                type="button"
                color="destructive"
                size="icon"
                aria-label="Remove row"
                onClick={() => handleDecrement(row.id)}
              >
                <Minus className="size-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}