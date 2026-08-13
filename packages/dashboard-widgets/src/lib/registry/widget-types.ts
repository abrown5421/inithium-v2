/**
 * `WidgetDefinition` (and its supporting types) is now canonically owned by `@inithium/plugin-engine`
 * — it's the exact contract shape plugins implement for the CMS Dashboard Widget Bank surface.
 * Re-exported here so existing imports from `@inithium/dashboard-widgets` keep working unchanged.
 */
export type {
  WidgetDefinition,
  WidgetContainerProps,
  WidgetConfigFormProps,
  CreateDefaultWidgetConfigParams
} from '@inithium/plugin-engine/client';
