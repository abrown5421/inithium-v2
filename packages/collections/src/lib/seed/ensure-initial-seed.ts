import { Db, Document, ObjectId } from 'mongodb';
import { ResultAsync, okAsync, errAsync } from 'neverthrow';
import { AppError } from '@inithium/types';
import { claimInitialSeed, completeInitialSeed } from '@inithium/db';
import { createInitialProfile } from '@inithium/services';
import { rawInsertMany } from './raw-insert.js';
import { SeedFixtures } from './load-seed-fixtures.js';

/**
 * `site.theme` / `site.logo` / `plugins.enabled` are already owned, and kept self-healing, by
 * `ensureDefaultSiteTheme` / `ensureDefaultSiteLogo` / `ensureDefaultPluginsEnabled`, which run on
 * every boot. Seeding them again here would create a second document with the same `settingName` —
 * nothing in this one-time path checks per-setting existence the way those do.
 */
const SETTINGS_OWNED_BY_BOOT_SEED = new Set(['site.theme', 'site.logo', 'plugins.enabled']);

/**
 * Reconciles the captured `profiles` snapshot against the users actually being seeded. The
 * exported data is hand-edited over time and can go stale: a profile whose `user_id` matches no
 * seeded user is dropped (most likely left over from a test user deleted after capture). Any
 * seeded user left with no matching profile gets a default one via `createInitialProfile` — the
 * same shape a normal registration produces — so every seeded account keeps the one-profile-per-
 * user invariant the rest of the app already relies on.
 */
const reconcileProfiles = (users: readonly Document[], profiles: readonly Document[]): readonly Document[] => {
  const seededUserIds = new Set(users.map((user) => String(user['_id'])));

  const validProfiles = profiles.filter((profile) => {
    const userId = profile['user_id'];
    const isValid = typeof userId === 'string' && seededUserIds.has(userId);
    if (!isValid) {
      console.warn(
        `Initial seed: dropping profile ${String(profile['_id'])} — its user_id (${String(userId)}) ` +
          'matches no seeded user. Likely stale data from a test user deleted after the export was captured.'
      );
    }
    return isValid;
  });

  const coveredUserIds = new Set(validProfiles.map((profile) => profile['user_id'] as string));

  const generatedProfiles: readonly Document[] = users
    .filter((user) => !coveredUserIds.has(String(user['_id'])))
    .map((user) => {
      const now = new Date();
      return {
        _id: new ObjectId(),
        ...createInitialProfile(String(user['_id'])),
        createdAt: now,
        updatedAt: now
      } as Document;
    });

  return [...validProfiles, ...generatedProfiles];
};

const runInitialSeed = (db: Db, fixtures: SeedFixtures): ResultAsync<void, AppError> => {
  const settings = fixtures.settings.filter(
    (setting) => !SETTINGS_OWNED_BY_BOOT_SEED.has(setting['settingName'] as string)
  );
  const profiles = reconcileProfiles(fixtures.users, fixtures.profiles);

  // collection-definitions/pages/settings first (no dependency on anything else), then users, then
  // profiles last since reconciling them depends on which users just landed.
  return rawInsertMany(db, 'collection-definitions', fixtures.collectionDefinitions)
    .andThen(() => rawInsertMany(db, 'pages', fixtures.pages))
    .andThen(() => rawInsertMany(db, 'settings', settings))
    .andThen(() => rawInsertMany(db, 'users', fixtures.users))
    .andThen(() => rawInsertMany(db, 'profiles', profiles))
    .map(() => undefined);
};

/**
 * Runs the one-time initial database seed for a freshly cloned Inithium project, importing the
 * hand-curated collection export (`users`, `pages`, `settings`, `collection-definitions`,
 * `profiles`) captured from the developer's own manually-built database. `assets` is deliberately
 * excluded — it's already fully reproduced on every boot by `ensureDefaultSystemFont`/
 * `ensureDefaultSystemLogo`, from the same fixed keys.
 *
 * Bypasses every collection service on purpose: `userService.createOne` would re-hash the already-
 * hashed passwords in the export, no repository accepts a caller-supplied `_id` (needed so
 * `profiles.user_id` keeps lining up with `users._id`), and `collectionDefinitionService.createOne`
 * scaffolds a brand-new generated collection as a side effect that must never run for the 3
 * hand-built collections (`page`/`setting`/`profile`). See `rawInsertMany`.
 *
 * This is deliberately NOT idempotent-per-document the way `ensureDefaultSiteTheme` and its
 * siblings are. Those self-heal one well-known framework default forever, on every boot, because
 * losing them breaks the app outright. This seed is app *content* that a project is expected to
 * edit and prune freely once it exists. So it runs exactly once, gated by the `_seed_state` marker
 * (`@inithium/db`'s `claimInitialSeed`/`completeInitialSeed`), and never again: deleting a seeded
 * page, user, or setting later is a normal, permanent edit, not something this function will ever
 * notice or undo.
 */
export const ensureInitialSeed = (db: Db, fixtures: SeedFixtures): ResultAsync<string, AppError> =>
  claimInitialSeed(db).andThen((claim) => {
    if (claim === 'already-seeded') {
      return okAsync('Initial seed already completed, skipping');
    }
    return runInitialSeed(db, fixtures)
      .andThen(() => completeInitialSeed(db))
      .map(() => 'Initial seed completed')
      .orElse((error) => {
        console.error(
          'Initial seed failed partway through. The seed marker was already claimed, so it will NOT be ' +
            'retried automatically on the next boot (retrying blind could duplicate whatever this run already ' +
            'inserted). Fix the underlying issue, then either finish seeding by hand or delete the ' +
            '"_seed_state" document in Mongo to allow a clean retry.',
          error
        );
        return errAsync(error);
      });
  });
