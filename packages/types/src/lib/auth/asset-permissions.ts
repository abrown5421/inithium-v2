import { UserRole } from './roles.js';
import { EntityPermissionMatrix, canAssignValue, canPerformAction, getEditableFields } from '../permissions/entity-permissions.js';

export type AssetAction = 'create' | 'update' | 'delete';

/** Fields present on the upload request's own payload — not columns on the Asset document. */
export type AssetEditableField = 'isSystem' | 'onBehalfOfUserId';

export const ASSET_EDITABLE_FIELDS: readonly AssetEditableField[] = ['isSystem', 'onBehalfOfUserId'];

/**
 * Single source of truth for what each role may do with Assets. Uploads are an admin-driven
 * action here, not a personal-upload feature for CMS staff: `editor` may only create *system*
 * assets (never tied to a user, never on behalf of one) and may only rename assets that are
 * already system assets — checked against the target record, since the generic engine only sees
 * the request payload, not the record being acted on. `writer` gets read-only access to the whole
 * library. Whichever role uploads, `isSystem`/ownership is fixed at creation time for everyone —
 * `updateAssetSchema` has no field for it at all, so there's no cap to express for update.
 */
export const ASSET_PERMISSION_MATRIX: EntityPermissionMatrix<UserRole, AssetAction, AssetEditableField, 'true' | 'false'> = {
  'super-admin': {
    actions: ['create', 'update', 'delete'],
    editableFields: ASSET_EDITABLE_FIELDS,
    assignableValues: ['true', 'false']
  },
  admin: {
    actions: ['create', 'update', 'delete'],
    editableFields: ASSET_EDITABLE_FIELDS,
    assignableValues: ['true', 'false']
  },
  editor: {
    actions: ['create', 'update'],
    editableFields: ['isSystem'],
    assignableValues: ['true']
  },
  writer: {
    actions: [],
    editableFields: [],
    assignableValues: []
  },
  user: {
    actions: [],
    editableFields: [],
    assignableValues: []
  }
};

export const canPerformAssetAction = (role: UserRole, action: AssetAction): boolean =>
  canPerformAction(ASSET_PERMISSION_MATRIX, role, action);

export const getEditableAssetFields = (role: UserRole): readonly AssetEditableField[] =>
  getEditableFields(ASSET_PERMISSION_MATRIX, role);

export const canAssignAssetIsSystem = (role: UserRole, value: 'true' | 'false'): boolean =>
  canAssignValue(ASSET_PERMISSION_MATRIX, role, value);
