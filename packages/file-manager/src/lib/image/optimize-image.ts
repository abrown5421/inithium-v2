import sharp from 'sharp';

/** Long-edge cap for ingested raster images — comfortably above every current on-screen use (navbar logos, avatars, thumbnails all render under 100px) while still covering full-bleed hero/content imagery. */
export const MAX_IMAGE_DIMENSION_PX = 2000;

const WEBP_QUALITY = 82;

const OPTIMIZABLE_IMAGE_MIME_TYPES: ReadonlySet<string> = new Set(['image/png', 'image/jpeg', 'image/jpg']);

export interface OptimizedImage {
  readonly buffer: Buffer;
  readonly mimeType: string;
  readonly extension: string;
  readonly width: number;
  readonly height: number;
}

/**
 * SVGs are vector (no benefit, sharp would rasterize them) and GIF/WebP/AVIF are left alone
 * (GIF animation would be lost by re-encoding; WebP/AVIF are already modern/compressed) — only
 * the raw camera/design-export formats that caused the original bandwidth incident are covered.
 */
export const isOptimizableImage = (mimeType: string): boolean =>
  OPTIMIZABLE_IMAGE_MIME_TYPES.has(mimeType.toLowerCase());

/**
 * Re-encodes PNG/JPEG uploads to WebP and caps the long edge at MAX_IMAGE_DIMENSION_PX.
 * Runs on every image upload so a full-resolution source file never reaches disk (or a
 * browser) at its original size/format — this is what stands between a raw 8MB hero photo
 * and what actually gets served.
 */
export const optimizeImage = async (buffer: Buffer): Promise<OptimizedImage> => {
  const { data, info } = await sharp(buffer, { failOn: 'none' })
    .rotate()
    .resize({
      width: MAX_IMAGE_DIMENSION_PX,
      height: MAX_IMAGE_DIMENSION_PX,
      fit: 'inside',
      withoutEnlargement: true
    })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer({ resolveWithObject: true });

  return { buffer: data, mimeType: 'image/webp', extension: '.webp', width: info.width, height: info.height };
};
