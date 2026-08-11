import * as React from 'react';

export interface AutoIncrementListRenderParams<T> {
  readonly value: T;
  readonly index: number;
  readonly isLastRow: boolean;
  readonly onChange: (value: T) => void;
}

export interface AutoIncrementListProps<T = unknown> {
  item?: React.ReactNode;
  values?: readonly T[];
  onValuesChange?: (values: T[]) => void;
  createItem?: () => T;
  renderItem?: (params: AutoIncrementListRenderParams<T>) => React.ReactNode;
  getRowContentClassName?: (value: T, index: number) => string;
  getRowKey?: (value: T, index: number) => React.Key;
  className?: string;
  rowClassName?: string;
}