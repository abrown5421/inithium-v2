import { Request } from 'express';
import {
  AppError,
  EntityPermissionMatrix,
  canAssignValue,
  canPerformAction,
  createForbiddenError,
  createUnauthorizedError,
  getDisallowedFields
} from '@inithium/types';
import { CrudOperation } from '../router/router.js';

export interface MatrixAuthorizerConfig<
  TRole extends string,
  TAction extends string,
  TField extends string,
  TAssignable extends string
> {
  readonly matrix: EntityPermissionMatrix<TRole, TAction, TField, TAssignable>;
  readonly allFields: readonly TField[];
  /** The one "capped" field (e.g. `role`) whose value is checked against `assignableValues`, if any. */
  readonly assignableField?: TField;
  readonly getRole: (req: Request) => TRole | undefined;
  /** Maps each mutating CRUD operation to the matrix action it requires. Operations left out (e.g. reads) are always allowed here. */
  readonly operationAction: Partial<Record<CrudOperation, TAction>>;
  /** Reject `createMany`/`updateMany` outright regardless of role. Default `true` — most entities don't need batch create/update from the CMS. */
  readonly disableBatch?: boolean;
}

/**
 * Builds a `CrudRouterOptions.authorize` callback from an `EntityPermissionMatrix`, so a new
 * entity's router gets the same actor- and payload-aware enforcement `users` has (which action
 * the acting role may perform, which fields it may set, and which values it may assign to the
 * one capped field) without re-deriving that logic per entity.
 */
export const createMatrixAuthorizer =
  <TRole extends string, TAction extends string, TField extends string, TAssignable extends string>(
    config: MatrixAuthorizerConfig<TRole, TAction, TField, TAssignable>
  ) =>
  (req: Request, operation: CrudOperation): AppError | undefined => {
    const role = config.getRole(req);
    if (!role) return createUnauthorizedError('Authentication required');

    const disableBatch = config.disableBatch ?? true;
    if (disableBatch && (operation === 'createMany' || operation === 'updateMany')) {
      return createForbiddenError('Batch create/update is not supported for this resource');
    }

    const action = config.operationAction[operation];
    if (!action) return undefined;

    if (!canPerformAction(config.matrix, role, action)) {
      return createForbiddenError(`You are not allowed to ${action} this resource`);
    }

    if (action === 'create' || action === 'update') {
      const payload = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, unknown>;

      const disallowedFields = getDisallowedFields(config.matrix, role, payload, config.allFields);
      if (disallowedFields.length > 0) {
        return createForbiddenError(`You are not allowed to set: ${disallowedFields.join(', ')}`);
      }

      if (config.assignableField) {
        const value = payload[config.assignableField];
        if (typeof value === 'string' && !canAssignValue(config.matrix, role, value as TAssignable)) {
          return createForbiddenError(`You are not allowed to assign this ${config.assignableField}`);
        }
      }
    }

    return undefined;
  };
