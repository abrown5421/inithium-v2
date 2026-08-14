import { z } from 'zod';
import { AlertTriangle } from 'lucide-react';
import type { ErrorLogWidgetConfig } from '@inithium/models';
import type { WidgetDefinition } from '../../registry/widget-types.js';
import { ErrorLogWidgetContainer } from './error-log-widget.container.js';
import { ErrorLogWidgetConfigForm } from './error-log-widget-config-form.js';

const errorLogWidgetConfigSchema: z.ZodType<ErrorLogWidgetConfig> = z.object({
  title: z.string().min(1).max(120),
  pageSize: z.number().int().min(1).max(50)
});

export const errorLogWidgetDefinition: WidgetDefinition<ErrorLogWidgetConfig> = {
  widgetType: 'error-log',
  displayName: 'Critical Error Log',
  description: 'Shows a log of critical errors encountered by end users.',
  icon: AlertTriangle,
  configSchema: errorLogWidgetConfigSchema,
  getTitle: (config) => config.title,
  createDefaultConfig: () => ({ title: 'Critical Error Log', pageSize: 5 }),
  renderContainer: ({ config }) => <ErrorLogWidgetContainer config={config} />,
  renderConfigForm: ({ config, onChange }) => <ErrorLogWidgetConfigForm config={config} onChange={onChange} />
};
