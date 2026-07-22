import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { parseEnv, createCorsOptions } from '@inithium/config';
import { connectToDatabase } from '@inithium/db';
import { createAuthenticateMiddleware, createRequireRoleMiddleware } from '@inithium/auth';
import { createUserCollection } from '@inithium/collections';
import { createAuthRouter, createHealthRouter } from '@inithium/routes';

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

  const authenticate = createAuthenticateMiddleware(env.JWT_ACCESS_SECRET);
  const requireAdmin = createRequireRoleMiddleware(['admin', 'super-admin']);

  const userCollection = createUserCollection(db, { authenticate, requireAdmin });

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

  app.listen(env.PORT, () => {
    console.log(`Application online on port ${env.PORT}`);
  });
};

bootstrap();
