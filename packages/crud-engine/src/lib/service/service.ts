import { z } from 'zod';
import { ResultAsync } from 'neverthrow';
import { AppError, BaseEntity, PaginatedResult } from '@inithium/types';
import { validateDoc, validateManyDocs } from '@inithium/validators';
import { CrudRepository } from '../repository/repository.js';

export interface CrudService<T extends BaseEntity, CreateDTO, UpdateDTO> {
  readonly createOne: (dto: CreateDTO) => ResultAsync<T, AppError>;
  readonly createMany: (dtos: readonly CreateDTO[]) => ResultAsync<readonly T[], AppError>;
  readonly readOne: (id: string) => ResultAsync<T, AppError>;
  readonly readMany: (ids: readonly string[]) => ResultAsync<readonly T[], AppError>;
  readonly readAll: (page?: number, limit?: number) => ResultAsync<PaginatedResult<T>, AppError>;
  readonly updateOne: (id: string, dto: UpdateDTO) => ResultAsync<T, AppError>;
  readonly updateMany: (items: readonly { readonly id: string; readonly data: UpdateDTO }[]) => ResultAsync<readonly T[], AppError>;
  readonly deleteOne: (id: string) => ResultAsync<void, AppError>;
  readonly deleteMany: (ids: readonly string[]) => ResultAsync<number, AppError>;
}

export const createService = <T extends BaseEntity, CreateDTO, UpdateDTO>(
  repo: CrudRepository<T>,
  createSchema: z.ZodSchema<CreateDTO>,
  updateSchema: z.ZodSchema<UpdateDTO>
): CrudService<T, CreateDTO, UpdateDTO> => {
  const batchUpdateSchema = z.array(
    z.object({
      id: z.string(),
      data: updateSchema
    })
  );

  return {
    createOne: (dto) =>
      validateDoc(createSchema)(dto).asyncAndThen((valid) =>
        repo.createOne(valid as Omit<T, '_id' | 'createdAt' | 'updatedAt'>)
      ),

    createMany: (dtos) =>
      validateManyDocs(createSchema)(dtos).asyncAndThen((valid) =>
        repo.createMany(valid as readonly Omit<T, '_id' | 'createdAt' | 'updatedAt'>[])
      ),

    readOne: (id) => repo.readOne(id),

    readMany: (ids) => repo.readMany(ids),

    readAll: (page = 1, limit = 25) => repo.readAll(page, limit),

    updateOne: (id, dto) =>
      validateDoc(updateSchema)(dto).asyncAndThen((valid) =>
        repo.updateOne(id, valid as Partial<Omit<T, '_id' | 'createdAt' | 'updatedAt'>>)
      ),

    updateMany: (items) =>
      validateDoc(batchUpdateSchema)(items).asyncAndThen((validItems) => {
        const payload = validItems.map((item) => ({
          id: item.id,
          data: item.data as Partial<Omit<T, '_id' | 'createdAt' | 'updatedAt'>>
        }));
        return repo.updateMany(payload);
      }),

    deleteOne: (id) => repo.deleteOne(id),

    deleteMany: (ids) => repo.deleteMany(ids)
  };
};