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

    updateMany: (items) => {
      const dataSet = items.map((i) => i.data);
      return validateManyDocs(updateSchema)(dataSet).asyncAndThen((validList) => {
        const validatedItems = items.map((item, idx) => ({
          id: item.id,
          data: validList[idx] as Partial<Omit<T, '_id' | 'createdAt' | 'updatedAt'>>
        }));
        return repo.updateMany(validatedItems);
      });
    },

    deleteOne: (id) => repo.deleteOne(id),

    deleteMany: (ids) => repo.deleteMany(ids)
  };
};