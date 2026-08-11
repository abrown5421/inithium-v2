import { ResultAsync, okAsync } from 'neverthrow';
import { AppError } from '@inithium/types';
import { AssetService } from '@inithium/services';

export interface DefaultSystemLogoSeed {
  readonly key: string;
  readonly originalName: string;
  readonly mimeType: string;
  readonly fileContentBase64: string;
}

/**
 * Fixed, well-known key (not `randomUUID()`) so `site.logo`'s seeded default value — and any
 * environment that already has this exact key from before this seed existed — keeps resolving
 * across reseeds instead of needing a code change every time the DB is rebuilt from scratch.
 */
export const PRIMARY_SYSTEM_LOGO_KEY = 'a2231849-e571-4d82-b039-b3e5993fa3c5';

const uploadSeed = (service: AssetService, seed: DefaultSystemLogoSeed): ResultAsync<string, AppError> =>
  service
    .uploadAsset({
      fileContentBase64: seed.fileContentBase64,
      originalName: seed.originalName,
      mimeType: seed.mimeType,
      userId: 'system',
      isSystem: true,
      key: seed.key
    })
    .map((asset) => `system logo "${seed.originalName}" seeded as ${asset.key}`);

/**
 * Idempotent, and self-healing against drift between Mongo and the file store: a matching `key`
 * record isn't trusted on its own, since it can outlive the file it points to (e.g. the backing
 * file gets moved/deleted outside the app). If the record's file no longer resolves, the stale
 * record is dropped and re-seeded from the fixture — which runs it through the same ingest
 * pipeline (PNG -> WebP) as any other upload. A record whose file still resolves is left alone.
 */
export const ensureDefaultSystemLogo = (
  service: AssetService,
  seed: DefaultSystemLogoSeed
): ResultAsync<string, AppError> =>
  service.readAll(1, 1, { key: seed.key }).andThen((result) => {
    const existing = result.data[0];
    if (!existing) {
      return uploadSeed(service, seed);
    }

    return service
      .getAssetFileStreamByKey(seed.key)
      .andThen(() => okAsync<string, AppError>(`system logo "${seed.originalName}" already exists, skipping seed`))
      .orElse(() => service.deleteOne(existing._id).andThen(() => uploadSeed(service, seed)));
  });
