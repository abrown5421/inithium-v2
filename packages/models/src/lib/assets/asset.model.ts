import { BaseEntity } from '@inithium/types';

export const ASSET_CATEGORIES = ['images', 'pdfs', 'videos', 'audio', 'fonts', 'archives', 'data', 'other'] as const;

export type AssetCategory = (typeof ASSET_CATEGORIES)[number];

export interface Asset extends BaseEntity {
  readonly key: string;
  readonly originalName: string;
  readonly filePath: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly uploadedBy: string;
  readonly isSystem: boolean;
  readonly category: AssetCategory;
}

export interface AssetWithUrl extends Asset {
  readonly url: string;
}