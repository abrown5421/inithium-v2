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
  updateSelfSchema,
  verifyPasswordSchema,
  changePasswordSchema,
  CreateUserDTO,
  UpdateUserDTO,
  LoginDTO,
  RegisterDTO,
  UpdateSelfDTO,
  VerifyPasswordDTO,
  ChangePasswordDTO,
  validateDoc
} from '@inithium/validators';

export type SanitizedUser = Omit<User, 'password'>;

const sanitize = (user: User): SanitizedUser => {
  const { password, ...rest } = user;
  return rest;
};

export interface UserServiceOptions {
  readonly onUserRegistered?: readonly ((userId: string) => void)[];
}

export interface UserService {
  readonly register: (dto: RegisterDTO) => ResultAsync<SanitizedUser, AppError>;
  readonly login: (dto: LoginDTO) => ResultAsync<SanitizedUser, AppError>;
  readonly createOne: (dto: CreateUserDTO) => ResultAsync<SanitizedUser, AppError>;
  readonly createMany: (dtos: readonly CreateUserDTO[]) => ResultAsync<readonly SanitizedUser[], AppError>;
  readonly readOne: (id: string) => ResultAsync<SanitizedUser, AppError>;
  readonly readMany: (ids: readonly string[]) => ResultAsync<readonly SanitizedUser[], AppError>;
  readonly readAll: (
    page?: number,
    limit?: number,
    filter?: Record<string, unknown>
  ) => ResultAsync<PaginatedResult<SanitizedUser>, AppError>;
  readonly updateOne: (id: string, dto: UpdateUserDTO) => ResultAsync<SanitizedUser, AppError>;
  readonly updateMany: (
    items: readonly { readonly id: string; readonly data: UpdateUserDTO }[]
  ) => ResultAsync<readonly SanitizedUser[], AppError>;
  readonly deleteOne: (id: string) => ResultAsync<void, AppError>;
  readonly deleteMany: (ids: readonly string[]) => ResultAsync<number, AppError>;
  readonly updateSelf: (userId: string, dto: UpdateSelfDTO) => ResultAsync<SanitizedUser, AppError>;
  readonly verifyPassword: (userId: string, dto: VerifyPasswordDTO) => ResultAsync<{ readonly verified: true }, AppError>;
  readonly changePassword: (userId: string, dto: ChangePasswordDTO) => ResultAsync<{ readonly changed: true }, AppError>;
}

export const createUserService = (repo: CrudRepository<User>, options: UserServiceOptions = {}): UserService => {
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
        createWithHashedPassword({ ...valid, role: 'user' }).map((user) => {
          options.onUserRegistered?.forEach((hook) => hook(user._id));
          return sanitize(user);
        })
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

    readAll: (page = 1, limit = 25, filter) =>
      repo
        .readAll(page, limit, filter as Filter<User>)
        .map((result) => ({ ...result, data: result.data.map(sanitize) })),

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

    deleteMany: (ids) => repo.deleteMany(ids),

    updateSelf: (userId, dto) =>
      validateDoc(updateSelfSchema)(dto).asyncAndThen((valid) => {
        const checkEmailConflict = valid.email
          ? repo.readAll(1, 1, { email: valid.email } as Filter<User>).andThen((existing) => {
              const conflict = existing.data.find((user) => user._id !== userId);
              return conflict
                ? errAsync(createConflictError('An account with this email already exists'))
                : okAsync(valid);
            })
          : okAsync(valid);

        return checkEmailConflict.andThen((data) =>
          repo.updateOne(userId, data as Partial<Omit<User, '_id' | 'createdAt' | 'updatedAt'>>).map(sanitize)
        );
      }),

    verifyPassword: (userId, dto) =>
      validateDoc(verifyPasswordSchema)(dto).asyncAndThen((valid) =>
        repo.readOne(userId).andThen((user) =>
          ResultAsync.fromSafePromise(comparePassword(valid.currentPassword, user.password)).andThen((matches) =>
            matches
              ? okAsync({ verified: true as const })
              : errAsync(createUnauthorizedError('Current password is incorrect'))
          )
        )
      ),

    changePassword: (userId, dto) =>
      validateDoc(changePasswordSchema)(dto).asyncAndThen((valid) =>
        repo.readOne(userId).andThen((user) =>
          ResultAsync.fromSafePromise(comparePassword(valid.currentPassword, user.password)).andThen((matches) => {
            if (!matches) {
              return errAsync(createUnauthorizedError('Current password is incorrect'));
            }
            return ResultAsync.fromSafePromise(hashPassword(valid.newPassword)).andThen((hashed) =>
              repo
                .updateOne(userId, { password: hashed } as Partial<Omit<User, '_id' | 'createdAt' | 'updatedAt'>>)
                .map(() => ({ changed: true as const }))
            );
          })
        )
      )
  };
};
