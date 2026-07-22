import { Db } from 'mongodb';
import { Router } from 'express';
import { ResultAsync } from 'neverthrow';
import { AppError } from '@inithium/types';
import { ensureIndex } from '@inithium/db';
import { createProductService, ProductService } from '@inithium/services';
import { createProductRouter } from '@inithium/routes';

export interface ProductCollectionModule {
  readonly service: ProductService;
  readonly router: Router;
}

export const initProductsCollection = (db: Db): ResultAsync<ProductCollectionModule, AppError> => {
  return ensureIndex(db, 'products', { slug: 1 }, { unique: true })
    .andThen(() => ensureIndex(db, 'products', { 'variants.sku': 1 }, { unique: true }))
    .map(() => {
      const service = createProductService(db);
      const router = createProductRouter(service);
      return { service, router };
    });
};