import { useState } from 'react';
import { Skeleton } from '@inithium/ui';
import {
  openAlert,
  useAppDispatch,
  useCreateUserDashboardConfigMutation,
  useGetReportableCollectionsQuery,
  useUpdateUserDashboardConfigMutation
} from '@inithium/store';
import type { WidgetLayoutItem } from '@inithium/models';
import { getWidgetDefinition, type WidgetDefinition } from '../registry/index.js';
import { AddWidgetDrawer } from '../drawer/add-widget-drawer.js';
import { WidgetConfigDialog } from '../widget-config/widget-config-dialog.js';
import { DashboardGrid } from './dashboard-grid.js';
import { generateWidgetId, useMyDashboardConfig } from './use-my-dashboard-config.js';

export const DashboardGridContainer = () => {
  const dispatch = useAppDispatch();
  const { data: dashboardConfig, isLoading } = useMyDashboardConfig();
  const { data: reportableCollections } = useGetReportableCollectionsQuery();
  const [createConfig] = useCreateUserDashboardConfigMutation();
  const [updateConfig, { isLoading: isSaving }] = useUpdateUserDashboardConfigMutation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [configuringWidgetId, setConfiguringWidgetId] = useState<string | undefined>(undefined);

  const widgets = dashboardConfig?.widgets ?? [];

  const persistWidgets = (nextWidgets: readonly WidgetLayoutItem[]): void => {
    const mutation = dashboardConfig
      ? updateConfig({ id: dashboardConfig._id, data: { widgets: [...nextWidgets] } }).unwrap()
      : createConfig({ widgets: [...nextWidgets] }).unwrap();

    mutation.catch(() => {
      dispatch(openAlert({ message: 'Failed to save dashboard layout', severity: 'destructive' }));
    });
  };

  const handleSelectWidget = (widgetDefinition: WidgetDefinition<never>): void => {
    const config = widgetDefinition.createDefaultConfig({ reportableCollections: reportableCollections ?? [] });
    const newWidget = {
      id: generateWidgetId(),
      widgetType: widgetDefinition.widgetType,
      config
    } as WidgetLayoutItem;
    persistWidgets([...widgets, newWidget]);
  };

  const handleRemoveWidget = (widgetId: string): void => {
    persistWidgets(widgets.filter((widget) => widget.id !== widgetId));
  };

  const handleSaveWidgetConfig = (widgetId: string, nextConfig: WidgetLayoutItem['config']): void => {
    persistWidgets(
      widgets.map((widget) => (widget.id === widgetId ? ({ ...widget, config: nextConfig } as WidgetLayoutItem) : widget))
    );
  };

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  const configuringWidget = configuringWidgetId
    ? widgets.find((widget) => widget.id === configuringWidgetId)
    : undefined;

  return (
    <>
      <DashboardGrid
        widgets={widgets}
        isSaving={isSaving}
        onAddWidgetsClick={() => setIsDrawerOpen(true)}
        onConfigureWidget={setConfiguringWidgetId}
        onRemoveWidget={handleRemoveWidget}
      />
      <AddWidgetDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} onSelectWidget={handleSelectWidget} />
      {configuringWidget ? (
        <WidgetConfigDialog
          open
          onOpenChange={(open) => {
            if (!open) setConfiguringWidgetId(undefined);
          }}
          widgetDefinition={
            getWidgetDefinition(configuringWidget.widgetType) as unknown as WidgetDefinition<typeof configuringWidget.config>
          }
          config={configuringWidget.config}
          onSave={(nextConfig) => handleSaveWidgetConfig(configuringWidget.id, nextConfig)}
        />
      ) : null}
    </>
  );
};
