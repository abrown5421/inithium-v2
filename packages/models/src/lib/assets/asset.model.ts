import { BaseEntity } from '@inithium/types';

export type AssetCategory = 'images' | 'pdfs' | 'videos' | 'audio' | 'other';

export interface Asset extends BaseEntity {
  readonly key: string;
  readonly originalName: string;
  readonly filePath: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly uploadedBy: string;
  readonly isSystem: boolean;
}

export interface AssetWithUrl extends Asset {
  readonly url: string;
}