import { UserRole } from './roles.js';
import { EntityPermissionMatrix, canPerformAction, getEditableFields } from '../permissions/entity-permissions.js';

export type SettingAction = 'create' | 'update' | 'delete';

export type SettingEditableField = 'settingName' | 'settingType' | 'settingSubType' | 'settingValue';

export const SETTING_EDITABLE_FIELDS: readonly SettingEditableField[] = [
  'settingName',
  'settingType',
  'settingSubType',
  'settingValue'
];

const ALL_FIELDS = SETTING_EDITABLE_FIELDS;

/**
 * Single source of truth for what each role may do to Setting records. Settings back site-wide
 * config, so creation (introducing a brand new key) is reserved for `super-admin`, while `admin`
 * may still view and edit values on settings that already exist. `editor`/`writer` get no actions
 * at all — the CMS nav entry for this page is expected to be scoped to `super-admin`/`admin` via
 * the page document's own `accessControl.roles`, and this matrix backs that up at the API layer.
 */
export const SETTING_PERMISSION_MATRIX: EntityPermissionMatrix<UserRole, SettingAction, SettingEditableField> = {
  'super-admin': { actions: ['create', 'update', 'delete'], editableFields: ALL_FIELDS },
  admin: { actions: ['update'], editableFields: ALL_FIELDS },
  editor: { actions: [], editableFields: [] },
  writer: { actions: [], editableFields: [] },
  user: { actions: [], editableFields: [] }
};

export const canPerformSettingAction = (role: UserRole, action: SettingAction): boolean =>
  canPerformAction(SETTING_PERMISSION_MATRIX, role, action);

export const getEditableSettingFields = (role: UserRole): readonly SettingEditableField[] =>
  getEditableFields(SETTING_PERMISSION_MATRIX, role);
