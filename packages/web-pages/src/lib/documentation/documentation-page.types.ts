import type * as React from 'react';
import type { CoreColorToken } from '@inithium/ui';

export interface PropDoc {
  readonly name: string;
  readonly type: string;
  readonly required?: boolean;
  readonly defaultValue?: string;
  readonly description: string;
}

export interface ComponentDoc {
  readonly id: string;
  readonly name: string;
  readonly summary: string;
  readonly importStatement: string;
  readonly props: readonly PropDoc[];
  readonly usageCode: string;
  readonly preview: React.ReactNode;
  /** Extra context, e.g. when this entry stands in for a component name that doesn't exist verbatim in @inithium/ui. */
  readonly notes?: string;
}

export interface DocumentationSection {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly components: readonly ComponentDoc[];
}

export interface ThemeTokenDoc {
  readonly token: CoreColorToken;
  readonly label: string;
  readonly cssVariable: string;
}

export interface ThemeHookDoc {
  readonly id: string;
  readonly name: string;
  readonly signature: string;
  readonly description: string;
  readonly usageCode: string;
}

export interface ThemeConceptDoc {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly usageCode?: string;
}
