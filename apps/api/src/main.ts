import express from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'node:path';
import fs from 'node:fs/promises';
import cookieParser from 'cookie-parser';
import { parseEnv, createCorsOptions } from '@inithium/config';
import { connectToDatabase } from '@inithium/db';
import { createAuthenticateMiddleware, createRequireRoleMiddleware } from '@inithium/auth';
import {
  createAssetCollection,
  createUserCollection,
  ensureAssetIndices,
  ensureDefaultSystemFont,
  PRIMARY_SYSTEM_FONT_KEY,
  SECONDARY_SYSTEM_FONT_KEY,
  ensureDefaultSystemLogo,
  PRIMARY_SYSTEM_LOGO_KEY,
  createCollectionDefinitionCollection,
  ensureCollectionDefinitionIndices
} from '@inithium/collections';
import { createFileRepository, createFileManagerService } from '@inithium/file-manager';
import { createAuthRouter, createFilesRouter, createHealthRouter, createProfileBannerImageRouter } from '@inithium/routes';
import { createPageCollection, ensurePageIndices } from '@inithium/collections';
import { createApiPubSubServer } from './pubsub.js';
import { createSettingCollection, ensureDefaultSiteTheme, ensureDefaultSiteLogo } from '@inithium/collections';
import { createProfileCollection } from '@inithium/collections';
import { createInitialProfile } from '@inithium/services';
// collection-generator:imports

const bootstrap = async (): Promise<void> => {
  const envResult = parseEnv(process.env);
  if (envResult.isErr()) {
    console.error(envResult.error);
    process.exit(1);
  }

  const env = envResult.value;
  const dbResult = await connectToDatabase(env.MONGO_URI);

  if (dbResult.isErr()) {
    console.error(dbResult.error);
    process.exit(1);
  }

  const db = dbResult.value;
  const app = express();

  app.use(cors(createCorsOptions(env.CORS_ORIGINS)));
  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: `${env.FILE_UPLOAD_MAX_SIZE_MB}mb` }));

  const fileManagerRootDir = path.resolve(env.APP_FILE_ROOT);
  await fs.mkdir(fileManagerRootDir, { recursive: true });
  const fileRepository = createFileRepository();
  const fileManagerService = createFileManagerService(fileRepository, { rootDir: fileManagerRootDir });

  const workspaceRootDir = path.resolve(env.WORKSPACE_ROOT); // error here
  const workspaceFileManagerService = createFileManagerService(fileRepository, { rootDir: workspaceRootDir });

  const authenticate = createAuthenticateMiddleware(env.JWT_ACCESS_SECRET);
  const requireAdmin = createRequireRoleMiddleware(['admin', 'super-admin']);

  const profileCollection = createProfileCollection(db, { authenticate });

  const userCollection = createUserCollection(db, {
    authenticate,
    onUserRegistered: (userId) => {
      void profileCollection.service.createOne(createInitialProfile(userId)).mapErr((error) => {
        console.error(`Failed to create initial profile for user ${userId}`, error);
      });
    }
  });

  const assetRootDir = path.resolve(env.APP_FILE_ROOT);
  await fs.mkdir(assetRootDir, { recursive: true });
  const assetFileManagerService = createFileManagerService(fileRepository, { rootDir: assetRootDir });

  const assetIndexResult = await ensureAssetIndices(db);
  if (assetIndexResult.isErr()) {
    console.error(assetIndexResult.error);
    process.exit(1);
  }

  const assetCollection = createAssetCollection(db, {
    fileManagerService: assetFileManagerService,
    authenticate,
    userService: userCollection.service,
    maxUploadSizeMb: env.FILE_UPLOAD_MAX_SIZE_MB,
    publicAssetBaseUrl: env.API_PUBLIC_ORIGIN
  });

  // Module-relative (not cwd-relative) so this resolves correctly whether main.ts runs directly
  // (dev) or as the esbuild-bundled dist output (prod), which mirrors the same nesting.
  const systemFontsDir = path.join(__dirname, 'assets', 'system-fonts');
  const [primaryFontBuffer, secondaryFontBuffer] = await Promise.all([
    fs.readFile(path.join(systemFontsDir, 'primary.ttf')),
    fs.readFile(path.join(systemFontsDir, 'secondary.ttf'))
  ]);

  const primaryFontSeedResult = await ensureDefaultSystemFont(assetCollection.service, {
    key: PRIMARY_SYSTEM_FONT_KEY,
    originalName: 'PrimaryFont.ttf',
    mimeType: 'font/ttf',
    fileContentBase64: primaryFontBuffer.toString('base64')
  });
  if (primaryFontSeedResult.isErr()) {
    console.error(primaryFontSeedResult.error);
    process.exit(1);
  }

  const secondaryFontSeedResult = await ensureDefaultSystemFont(assetCollection.service, {
    key: SECONDARY_SYSTEM_FONT_KEY,
    originalName: 'SecondaryFont.ttf',
    mimeType: 'font/ttf',
    fileContentBase64: secondaryFontBuffer.toString('base64')
  });
  if (secondaryFontSeedResult.isErr()) {
    console.error(secondaryFontSeedResult.error);
    process.exit(1);
  }

  const systemLogoDir = path.join(__dirname, 'assets', 'system-logo');
  const primaryLogoBuffer = await fs.readFile(path.join(systemLogoDir, 'primary-logo.png'));

  const primaryLogoSeedResult = await ensureDefaultSystemLogo(assetCollection.service, {
    key: PRIMARY_SYSTEM_LOGO_KEY,
    originalName: 'PrimaryLogo.png',
    mimeType: 'image/png',
    fileContentBase64: primaryLogoBuffer.toString('base64')
  });
  if (primaryLogoSeedResult.isErr()) {
    console.error(primaryLogoSeedResult.error);
    process.exit(1);
  }

  const collectionDefinitionIndexResult = await ensureCollectionDefinitionIndices(db);
  if (collectionDefinitionIndexResult.isErr()) {
    console.error(collectionDefinitionIndexResult.error);
    process.exit(1);
  }

  const collectionDefinitionCollection = createCollectionDefinitionCollection(db, {
    authenticate,
    protectedMiddleware: [requireAdmin],
    generatorConfig: { fileManagerService: workspaceFileManagerService }
  });

  const pageIndexResult = await ensurePageIndices(db);
  if (pageIndexResult.isErr()) {
    console.error(pageIndexResult.error);
    process.exit(1);
  }

  const pageCollection = createPageCollection(db, { authenticate });
  const settingCollection = createSettingCollection(db, { authenticate });

  const siteThemeSeedResult = await ensureDefaultSiteTheme(settingCollection.service);
  if (siteThemeSeedResult.isErr()) {
    console.error(siteThemeSeedResult.error);
    process.exit(1);
  }

  const siteLogoSeedResult = await ensureDefaultSiteLogo(settingCollection.service);
  if (siteLogoSeedResult.isErr()) {
    console.error(siteLogoSeedResult.error);
    process.exit(1);
  }
// collection-generator:instances

  app.use('/health', createHealthRouter());
  app.use(
    '/auth',
    createAuthRouter(userCollection.service, {
      accessSecret: env.JWT_ACCESS_SECRET,
      accessExpiry: env.JWT_ACCESS_EXPIRY,
      refreshSecret: env.JWT_REFRESH_SECRET,
      refreshExpiry: env.JWT_REFRESH_EXPIRY,
      cookieSecure: env.COOKIE_SECURE,
      cookieDomain: env.COOKIE_DOMAIN,
      authenticate
    })
  );

  app.use('/users', userCollection.router);
  app.use('/assets', assetCollection.router);
  app.use('/collection-definitions', collectionDefinitionCollection.router);
  app.use('/files', createFilesRouter(fileManagerService, { authenticate, requireAdmin }));
  app.use('/pages', pageCollection.router);
  app.use('/settings', settingCollection.router);
  app.use(
    '/profiles/banner-image',
    createProfileBannerImageRouter(assetCollection.service, { authenticate, maxUploadSizeMb: env.FILE_UPLOAD_MAX_SIZE_MB })
  );
  app.use('/profiles', profileCollection.router);
// collection-generator:routes

  const httpServer = app.listen(env.PORT, () => {
    console.log(`Application online on port ${env.PORT}`);
  });

  createApiPubSubServer({
    httpServer,
    jwtAccessSecret: env.JWT_ACCESS_SECRET,
    cors: createCorsOptions(env.CORS_ORIGINS)
  });
};

bootstrap();