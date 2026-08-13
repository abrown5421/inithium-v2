import type { ComponentType, ReactElement } from 'react';
import type { ZodType } from 'zod';
import type { PageLayoutRegistry } from '@inithium/pages';
import type { PluginMeta } from './plugin-meta.types.js';

export interface ProfileTabContext {
  readonly isOwner: boolean;
  readonly userId: string;
}

export interface ProfileTabDefinition {
  readonly id: string;
  readonly label: string;
  readonly icon: ComponentType<{ readonly className?: string }>;
  readonly component: ComponentType<{ readonly context: ProfileTabContext }>;
  readonly enabled?: (context: ProfileTabContext) => boolean;
}

export interface WidgetContainerProps<TConfig> {
  readonly id: string;
  readonly config: TConfig;
}

export interface WidgetConfigFormProps<TConfig> {
  readonly config: TConfig;
  readonly onChange: (config: TConfig) => void;
}

export interface CreateDefaultWidgetConfigParams {
  readonly reportableCollections: readonly string[];
}

export interface WidgetDefinition<TConfig> {
  readonly widgetType: string;
  readonly displayName: string;
  readonly description: string;
  readonly icon: ComponentType<{ readonly className?: string }>;
  /** Runtime validation for `config` — required now that `widgetType` is an open string rather than a closed union. */
  readonly configSchema: ZodType<TConfig>;
  readonly getTitle: (config: TConfig) => string;
  readonly createDefaultConfig: (params: CreateDefaultWidgetConfigParams) => TConfig;
  readonly renderContainer: (props: WidgetContainerProps<TConfig>) => ReactElement;
  readonly renderConfigForm: (props: WidgetConfigFormProps<TConfig>) => ReactElement;
}

export interface PluginClientModule extends PluginMeta {
  readonly pageLayouts?: PageLayoutRegistry;
  readonly profileTabs?: readonly ProfileTabDefinition[];
  readonly widgets?: Readonly<Record<string, WidgetDefinition<never>>>;
  /**
   * Rendered once, unconditionally, for the lifetime of the app — for things that must stay live
   * regardless of which page is showing (e.g. a real-time notification listener). Each component
   * receives no props and should render `null`; side effects happen via hooks.
   */
  readonly backgroundComponents?: readonly ComponentType[];
}
