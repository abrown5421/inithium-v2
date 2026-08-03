import { USER_ROLES, UserRole } from './roles.js';
import {
  EntityPermissionMatrix,
  canAssignValue,
  canPerformAction,
  getAssignableValues,
  getDisallowedFields,
  getEditableFields
} from '../permissions/entity-permissions.js';

export type UserAction = 'create' | 'update' | 'delete';

export type UserEditableField = 'first_name' | 'last_name' | 'email' | 'password' | 'role';

export const USER_EDITABLE_FIELDS: readonly UserEditableField[] = [
  'first_name',
  'last_name',
  'email',
  'password',
  'role'
];

const ALL_FIELDS = USER_EDITABLE_FIELDS;
const NAME_AND_EMAIL_FIELDS: readonly UserEditableField[] = ['first_name', 'last_name', 'email'];

/**
 * Single source of truth for what each role may do to User records. Add a role by adding an
 * entry here; add a new editable field by adding it to `UserEditableField` and the roles that
 * may set it. Both the API (authorization) and the CMS UI (what renders) read from this. Built
 * on the generic `EntityPermissionMatrix` engine so the same lookup helpers work for any future
 * entity's matrix.
 */
export const USER_PERMISSION_MATRIX: EntityPermissionMatrix<UserRole, UserAction, UserEditableField, UserRole> = {
  'super-admin': {
    actions: ['create', 'update', 'delete'],
    editableFields: ALL_FIELDS,
    assignableValues: USER_ROLES
  },
  admin: {
    actions: ['create', 'update', 'delete'],
    editableFields: ALL_FIELDS,
    assignableValues: USER_ROLES.filter((role) => role !== 'super-admin')
  },
  editor: {
    actions: ['create', 'update'],
    editableFields: ALL_FIELDS,
    assignableValues: ['editor', 'writer', 'user']
  },
  writer: {
    actions: ['update'],
    editableFields: NAME_AND_EMAIL_FIELDS,
    assignableValues: []
  },
  user: {
    actions: [],
    editableFields: [],
    assignableValues: []
  }
};

export const canPerformUserAction = (role: UserRole, action: UserAction): boolean =>
  canPerformAction(USER_PERMISSION_MATRIX, role, action);

export const getEditableUserFields = (role: UserRole): readonly UserEditableField[] =>
  getEditableFields(USER_PERMISSION_MATRIX, role);

export const getAssignableUserRoles = (role: UserRole): readonly UserRole[] =>
  getAssignableValues(USER_PERMISSION_MATRIX, role);

export const canAssignUserRole = (actingRole: UserRole, targetRole: UserRole): boolean =>
  canAssignValue(USER_PERMISSION_MATRIX, actingRole, targetRole);

/** Field keys present on `payload` that `role` is not allowed to set at all. */
export const getDisallowedUserFields = (role: UserRole, payload: Record<string, unknown>): readonly string[] =>
  getDisallowedFields(USER_PERMISSION_MATRIX, role, payload, ALL_FIELDS);
