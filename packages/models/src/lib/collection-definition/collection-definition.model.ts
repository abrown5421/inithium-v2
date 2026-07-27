import { BaseEntity } from '@inithium/types';

export const COLLECTION_FIELD_TYPES = ['string', 'number', 'boolean', 'date', 'objectId', 'string-array'] as const;

export type CollectionFieldType = (typeof COLLECTION_FIELD_TYPES)[number];

export interface CollectionFieldDefinition {
  readonly name: string;
  readonly type: CollectionFieldType;
  readonly required: boolean;
  readonly unique?: boolean;
}

export interface CollectionDefinition extends BaseEntity {
  readonly name: string;
  readonly pluralName: string;
  readonly fields: readonly CollectionFieldDefinition[];
  readonly publicRoutes?: readonly string[];
}