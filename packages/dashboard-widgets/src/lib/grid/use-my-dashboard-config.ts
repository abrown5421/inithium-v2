import { skipToken } from '@reduxjs/toolkit/query/react';
import { selectCurrentUser, useAppSelector, useReadAllUserDashboardConfigsQuery } from '@inithium/store';
import type { WidgetLayoutItem } from '@inithium/models';

export const generateWidgetId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `widget-${Date.now()}-${Math.random().toString(36).slice(2)}`;

/**
 * Widgets saved before grid-position fields (`i`/`x`/`y`/`w`/`h`) were dropped in favor of a plain
 * `id` won't have `id` set. Backfill it from the legacy `i` field (or generate a fresh one) so those
 * widgets stay addressable — the next save naturally drops the now-unused legacy fields via Zod.
 */
const normalizeWidget = (widget: WidgetLayoutItem): WidgetLayoutItem => {
  if (widget.id) return widget;
  const legacyId = (widget as unknown as { readonly i?: string }).i;
  return { ...widget, id: legacyId ?? generateWidgetId() } as WidgetLayoutItem;
};

export const useMyDashboardConfig = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const query = useReadAllUserDashboardConfigsQuery(
    currentUser ? { field: 'userId', search: currentUser.id, limit: 1 } : skipToken
  );
  const dashboardConfig = query.data?.data[0];

  return {
    ...query,
    data: dashboardConfig ? { ...dashboardConfig, widgets: dashboardConfig.widgets.map(normalizeWidget) } : undefined
  };
};
