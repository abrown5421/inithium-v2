import { ResultAsync, okAsync } from 'neverthrow';
import { AppError } from '@inithium/types';
import { AssetService } from '@inithium/services';

export interface DefaultSystemFontSeed {
  readonly key: string;
  readonly originalName: string;
  readonly mimeType: string;
  readonly fileContentBase64: string;
}

/**
 * Fixed, well-known keys (not `randomUUID()`) so the `@font-face` URLs hardcoded into
 * `packages/ui/src/styles/globals.css` stay stable across environments/reseeds instead of
 * needing a code change every time the DB is rebuilt from scratch.
 */
export const PRIMARY_SYSTEM_FONT_KEY = '900e0f9c-97e7-4213-a3cb-82c63e1e8350';
export const SECONDARY_SYSTEM_FONT_KEY = 'ea51f172-5c66-4466-ab57-9a72766a9fae';

const uploadSeed = (service: AssetService, seed: DefaultSystemFontSeed): ResultAsync<string, AppError> =>
  service
    .uploadAsset({
      fileContentBase64: seed.fileContentBase64,
      originalName: seed.originalName,
      mimeType: seed.mimeType,
      userId: 'system',
      isSystem: true,
      key: seed.key
    })
    .map((asset) => `system font "${seed.originalName}" seeded as ${asset.key}`);

/**
 * Idempotent, and self-healing against drift between Mongo and the file store: a matching `key`
 * record isn't trusted on its own, since it can outlive the file it points to (e.g. the backing
 * file gets moved/deleted outside the app). If the record's file no longer resolves, the stale
 * record is dropped and re-seeded from the fixture — which runs it through the same ingest
 * pipeline (TTF -> WOFF2) as any other upload. A record whose file still resolves is left alone.
 */
export const ensureDefaultSystemFont = (
  service: AssetService,
  seed: DefaultSystemFontSeed
): ResultAsync<string, AppError> =>
  service.readAll(1, 1, { key: seed.key }).andThen((result) => {
    const existing = result.data[0];
    if (!existing) {
      return uploadSeed(service, seed);
    }

    return service
      .getAssetFileStreamByKey(seed.key)
      .andThen(() => okAsync<string, AppError>(`system font "${seed.originalName}" already exists, skipping seed`))
      .orElse(() => service.deleteOne(existing._id).andThen(() => uploadSeed(service, seed)));
  });
