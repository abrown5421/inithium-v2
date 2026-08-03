import express from 'express';
import cors from 'cors';
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
  createCollectionDefinitionCollection,
  ensureCollectionDefinitionIndices
} from '@inithium/collections';
import { createFileRepository, createFileManagerService } from '@inithium/file-manager';
import { createAuthRouter, createFilesRouter, createHealthRouter } from '@inithium/routes';
import { createPageCollection, ensurePageIndices } from '@inithium/collections';
import { createApiPubSubServer } from './pubsub.js';
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
  app.use(express.json());
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

  const userCollection = createUserCollection(db, { authenticate });

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