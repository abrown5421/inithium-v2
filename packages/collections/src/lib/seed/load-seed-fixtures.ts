import path from 'node:path';
import fs from 'node:fs/promises';
import { Document } from 'mongodb';
import { EJSON } from 'bson';

export interface SeedFixtures {
  readonly users: readonly Document[];
  readonly pages: readonly Document[];
  readonly settings: readonly Document[];
  readonly collectionDefinitions: readonly Document[];
  readonly profiles: readonly Document[];
}

const readFixture = async (seedDataDir: string, fileName: string): Promise<readonly Document[]> => {
  const raw = await fs.readFile(path.join(seedDataDir, fileName), 'utf-8');
  // Default (non-relaxed) EJSON parsing turns `{"$oid": ...}` / `{"$date": ...}` back into real
  // `ObjectId` / `Date` instances, matching what the export (PyMongo's `bson.json_util.dumps`)
  // produced them from — required so `rawInsertMany` writes native BSON types, not string stand-ins.
  return EJSON.parse(raw) as readonly Document[];
};

/**
 * Loads the hand-curated collection export sitting alongside this build (see `apps/api/src/assets/
 * seed-data`, copied into `dist` by the api app's existing esbuild `assets` glob — the same
 * mechanism that already ships the system font/logo files `ensureDefaultSystemFont`/
 * `ensureDefaultSystemLogo` read). Pure filesystem + parsing, no DB access, so `ensureInitialSeed`
 * itself has no filesystem knowledge — mirrors how `main.ts` reads font/logo buffers off disk and
 * hands them to those `ensureDefault*` functions.
 */
export const loadSeedFixtures = async (seedDataDir: string): Promise<SeedFixtures> => {
  const [users, pages, settings, collectionDefinitions, profiles] = await Promise.all([
    readFixture(seedDataDir, 'users.json'),
    readFixture(seedDataDir, 'pages.json'),
    readFixture(seedDataDir, 'settings.json'),
    readFixture(seedDataDir, 'collection-definitions.json'),
    readFixture(seedDataDir, 'profiles.json')
  ]);

  return { users, pages, settings, collectionDefinitions, profiles };
};
