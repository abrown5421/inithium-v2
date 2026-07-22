import express from 'express';
import cors from 'cors';
import { parseEnv, createCorsOptions } from '@inithium/config';
import { connectToDatabase } from '@inithium/db';
import { initProductsCollection } from '@inithium/collections';

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

  const productsModuleResult = await initProductsCollection(db);
  if (productsModuleResult.isErr()) {
    console.error(productsModuleResult.error);
    process.exit(1);
  }

  const productsModule = productsModuleResult.value;
  app.use('/api/v1/products', productsModule.router);

  app.listen(env.PORT, () => {
    console.log(`Application online on port ${env.PORT}`);
  });
};

bootstrap();