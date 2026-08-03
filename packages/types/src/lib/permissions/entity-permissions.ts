/**
 * Generic engine behind any entity's role-permission matrix (e.g. `USER_PERMISSION_MATRIX` in
 * `../auth/user-permissions.js`). An entity defines its own `TRole`/`TAction`/`TField` unions and
 * an `EntityPermissionMatrix` mapping each role to what it may do; these helpers are how both the
 * API (authorization) and the UI (what renders) read that matrix, without re-deriving the same
 * lookup logic per entity.
 */

export interface EntityPermissions<
  TAction extends string,
  TField extends string,
  TAssignable extends string = never
> {
  readonly actions: readonly TAction[];
  readonly editableFields: readonly TField[];
  /** Values assignable to this entity's one "capped" field (e.g. `role`), if it has one. */
  readonly assignableValues?: readonly TAssignable[];
}

export type EntityPermissionMatrix<
  TRole extends string,
  TAction extends string,
  TField extends string,
  TAssignable extends string = never
> = Readonly<Record<TRole, EntityPermissions<TAction, TField, TAssignable>>>;

export const canPerformAction = <TRole extends string, TAction extends string, TField extends string, TAssignable extends string>(
  matrix: EntityPermissionMatrix<TRole, TAction, TField, TAssignable>,
  role: TRole,
  action: TAction
): boolean => matrix[role].actions.includes(action);

export const getEditableFields = <TRole extends string, TAction extends string, TField extends string, TAssignable extends string>(
  matrix: EntityPermissionMatrix<TRole, TAction, TField, TAssignable>,
  role: TRole
): readonly TField[] => matrix[role].editableFields;

export const getAssignableValues = <TRole extends string, TAction extends string, TField extends string, TAssignable extends string>(
  matrix: EntityPermissionMatrix<TRole, TAction, TField, TAssignable>,
  role: TRole
): readonly TAssignable[] => matrix[role].assignableValues ?? [];

export const canAssignValue = <TRole extends string, TAction extends string, TField extends string, TAssignable extends string>(
  matrix: EntityPermissionMatrix<TRole, TAction, TField, TAssignable>,
  role: TRole,
  value: TAssignable
): boolean => getAssignableValues(matrix, role).includes(value);

/** Field keys present on `payload` that `role` is not allowed to set, out of `allFields`. */
export const getDisallowedFields = <TRole extends string, TAction extends string, TField extends string, TAssignable extends string>(
  matrix: EntityPermissionMatrix<TRole, TAction, TField, TAssignable>,
  role: TRole,
  payload: Record<string, unknown>,
  allFields: readonly TField[]
): readonly string[] => {
  const allowed = new Set<string>(getEditableFields(matrix, role));
  return Object.keys(payload).filter((key) => (allFields as readonly string[]).includes(key) && !allowed.has(key));
};
