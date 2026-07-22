import { Filter } from 'mongodb';
import { ResultAsync, okAsync, errAsync } from 'neverthrow';
import { AppError, PaginatedResult, createConflictError, createUnauthorizedError } from '@inithium/types';
import { CrudRepository } from '@inithium/crud-engine';
import { User } from '@inithium/models';
import { hashPassword, comparePassword } from '@inithium/auth';
import {
  createUserSchema,
  updateUserSchema,
  loginSchema,
  registerSchema,
  CreateUserDTO,
  UpdateUserDTO,
  LoginDTO,
  RegisterDTO,
  validateDoc
} from '@inithium/validators';

export type SanitizedUser = Omit<User, 'password'>;

const sanitize = (user: User): SanitizedUser => {
  const { password, ...rest } = user;
  return rest;
};

export interface UserService {
  readonly register: (dto: RegisterDTO) => ResultAsync<SanitizedUser, AppError>;
  readonly login: (dto: LoginDTO) => ResultAsync<SanitizedUser, AppError>;
  readonly createOne: (dto: CreateUserDTO) => ResultAsync<SanitizedUser, AppError>;
  readonly createMany: (dtos: readonly CreateUserDTO[]) => ResultAsync<readonly SanitizedUser[], AppError>;
  readonly readOne: (id: string) => ResultAsync<SanitizedUser, AppError>;
  readonly readMany: (ids: readonly string[]) => ResultAsync<readonly SanitizedUser[], AppError>;
  readonly readAll: (page?: number, limit?: number) => ResultAsync<PaginatedResult<SanitizedUser>, AppError>;
  readonly updateOne: (id: string, dto: UpdateUserDTO) => ResultAsync<SanitizedUser, AppError>;
  readonly updateMany: (
    items: readonly { readonly id: string; readonly data: UpdateUserDTO }[]
  ) => ResultAsync<readonly SanitizedUser[], AppError>;
  readonly deleteOne: (id: string) => ResultAsync<void, AppError>;
  readonly deleteMany: (ids: readonly string[]) => ResultAsync<number, AppError>;
}

export const createUserService = (repo: CrudRepository<User>): UserService => {
  const findByEmail = (email: string): ResultAsync<User, AppError> => {
    return repo.readAll(1, 1, { email } as Filter<User>).andThen((result) => {
      const user = result.data[0];
      if (!user) {
        return errAsync(createUnauthorizedError('Invalid email or password'));
      }
      return okAsync(user);
    });
  };

  const createWithHashedPassword = (dto: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: User['role'];
  }): ResultAsync<User, AppError> => {
    return repo.readAll(1, 1, { email: dto.email } as Filter<User>).andThen((existing) => {
      if (existing.data.length > 0) {
        return errAsync(createConflictError('An account with this email already exists'));
      }
      return ResultAsync.fromSafePromise(hashPassword(dto.password)).andThen((hashed) =>
        repo.createOne({ ...dto, password: hashed } as Omit<User, '_id' | 'createdAt' | 'updatedAt'>)
      );
    });
  };

  return {
    register: (dto) =>
      validateDoc(registerSchema)(dto).asyncAndThen((valid) =>
        createWithHashedPassword({ ...valid, role: 'user' }).map(sanitize)
      ),

    login: (dto) =>
      validateDoc(loginSchema)(dto).asyncAndThen((valid) =>
        findByEmail(valid.email).andThen((user) =>
          ResultAsync.fromSafePromise(comparePassword(valid.password, user.password)).andThen((matches) =>
            matches ? okAsync(sanitize(user)) : errAsync(createUnauthorizedError('Invalid email or password'))
          )
        )
      ),

    createOne: (dto) =>
      validateDoc(createUserSchema)(dto).asyncAndThen((valid) => createWithHashedPassword(valid).map(sanitize)),

    createMany: (dtos) => {
      const validationResults = dtos.map((dto) => validateDoc(createUserSchema)(dto));
      const firstError = validationResults.find((result) => result.isErr());
      if (firstError && firstError.isErr()) {
        return errAsync(firstError.error);
      }
      const valid = validationResults.map((result) => (result.isOk() ? result.value : (undefined as never)));

      return ResultAsync.fromSafePromise(Promise.all(valid.map((v) => hashPassword(v.password)))).andThen(
        (hashed) => {
          const payloads = valid.map((v, idx) => ({ ...v, password: hashed[idx] }));
          return repo
            .createMany(payloads as readonly Omit<User, '_id' | 'createdAt' | 'updatedAt'>[])
            .map((users) => users.map(sanitize));
        }
      );
    },

    readOne: (id) => repo.readOne(id).map(sanitize),

    readMany: (ids) => repo.readMany(ids).map((users) => users.map(sanitize)),

    readAll: (page = 1, limit = 25) =>
      repo.readAll(page, limit).map((result) => ({ ...result, data: result.data.map(sanitize) })),

    updateOne: (id, dto) =>
      validateDoc(updateUserSchema)(dto).asyncAndThen((valid) =>
        repo.updateOne(id, valid as Partial<Omit<User, '_id' | 'createdAt' | 'updatedAt'>>).map(sanitize)
      ),

    updateMany: (items) =>
      repo
        .updateMany(
          items.map((item) => ({
            id: item.id,
            data: item.data as Partial<Omit<User, '_id' | 'createdAt' | 'updatedAt'>>
          }))
        )
        .map((users) => users.map(sanitize)),

    deleteOne: (id) => repo.deleteOne(id),

    deleteMany: (ids) => repo.deleteMany(ids)
  };
};
