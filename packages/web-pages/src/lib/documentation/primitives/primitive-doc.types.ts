import type * as React from 'react';

export interface PropDoc {
  readonly name: string;
  readonly type: string;
  readonly required?: boolean;
  readonly defaultValue?: string;
  readonly description: string;
}

export interface PropGroup {
  readonly component: string;
  readonly props: readonly PropDoc[];
}

export interface UsageExample {
  readonly title: string;
  readonly description?: string;
  readonly code: string;
  readonly preview: React.ReactNode;
}

export interface PrimitiveDoc {
  readonly overview: React.ReactNode;
  readonly importStatement: string;
  readonly propGroups: readonly PropGroup[];
  readonly examples: readonly UsageExample[];
}
