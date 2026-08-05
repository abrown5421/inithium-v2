import * as React from 'react';

export interface AutoIncrementListRenderParams<T> {
  readonly value: T;
  readonly index: number;
  readonly isLastRow: boolean;
  readonly onChange: (value: T) => void;
}

export interface AutoIncrementListProps<T = unknown> {
  /**
   * Template rendered in every row when the list manages its own row state internally (the
   * original, uncontrolled mode) — a primitive, standard HTML element, or UI library/composite
   * component, re-rendered unchanged once per row so each mounts its own independent instance.
   * Ignored once `values`/`onValuesChange`/`createItem`/`renderItem` are all supplied.
   */
  item?: React.ReactNode;
  /** Controlled mode: the current row values. Supplying this (with the props below) switches the list from managing its own row state to reflecting this array exactly. */
  values?: readonly T[];
  /** Controlled mode: called with the full next array whenever a row is added, removed, or edited. */
  onValuesChange?: (values: readonly T[]) => void;
  /** Controlled mode: builds the value for a newly added row. */
  createItem?: () => T;
  /** Controlled mode: renders one row's editable content for its current value. */
  renderItem?: (params: AutoIncrementListRenderParams<T>) => React.ReactNode;
  /**
   * Controlled mode: className for a row's content wrapper, keyed off that row's own value —
   * defaults to `'min-w-0 flex-1'` (content stretches to fill the row, pushing the +/- button to
   * the row's far edge) when omitted. Override this per-row for content that shouldn't stretch
   * (e.g. a "key + type" header with no inline value control) so its +/- button sits directly
   * next to the content instead of being stranded behind a blank stretched gap.
   */
  getRowContentClassName?: (value: T, index: number) => string;
  /**
   * Controlled mode: stable React key per row, keyed off the row's own value rather than its
   * array position — supply this whenever `T` carries its own id, so removing a row from the
   * middle of the list doesn't reshuffle keys (and remount/lose focus in) every row after it.
   * Falls back to array index when omitted.
   */
  getRowKey?: (value: T, index: number) => React.Key;
  className?: string;
  rowClassName?: string;
}
