import type { ComponentType, ReactElement } from 'react';
import type { WidgetType } from '@inithium/models';

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
  readonly widgetType: WidgetType;
  readonly displayName: string;
  readonly description: string;
  readonly icon: ComponentType<{ readonly className?: string }>;
  readonly getTitle: (config: TConfig) => string;
  readonly createDefaultConfig: (params: CreateDefaultWidgetConfigParams) => TConfig;
  readonly renderContainer: (props: WidgetContainerProps<TConfig>) => ReactElement;
  readonly renderConfigForm: (props: WidgetConfigFormProps<TConfig>) => ReactElement;
}
