import type * as React from 'react';
import type { PropDoc, PropGroup, UsageExample } from '../primitives/primitive-doc.types.js';

export type { PropDoc, PropGroup, UsageExample };

export interface CompositionEntry {
  readonly name: string;
  readonly role: string;
}

export interface CompositeDoc {
  readonly overview: React.ReactNode;
  readonly importStatement: string;
  readonly composition: readonly CompositionEntry[];
  readonly propGroups: readonly PropGroup[];
  readonly examples: readonly UsageExample[];
}
