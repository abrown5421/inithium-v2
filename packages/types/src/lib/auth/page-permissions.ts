import { UserRole } from './roles.js';
import { EntityPermissionMatrix, canPerformAction, getEditableFields } from '../permissions/entity-permissions.js';

export type PageAction = 'create' | 'update' | 'delete';

export type PageEditableField =
  | 'id'
  | 'pageName'
  | 'route'
  | 'app'
  | 'theme'
  | 'animations'
  | 'accessControl'
  | 'flags'
  | 'metadata'
  | 'navigation';

export const PAGE_EDITABLE_FIELDS: readonly PageEditableField[] = [
  'id',
  'pageName',
  'route',
  'app',
  'theme',
  'animations',
  'accessControl',
  'flags',
  'metadata',
  'navigation'
];

const ALL_FIELDS = PAGE_EDITABLE_FIELDS;
/** Everything except the security/system-relevant groups — access control and the isActive/isSystem flags. */
const EDITOR_FIELDS: readonly PageEditableField[] = ALL_FIELDS.filter(
  (field) => field !== 'accessControl' && field !== 'flags'
);
/** Content only. */
const WRITER_FIELDS: readonly PageEditableField[] = ['pageName', 'metadata'];

/**
 * Single source of truth for what each role may do to Page records. Pages are more sensitive
 * than Users — `accessControl`/`flags` govern which roles can even see a given CMS route — so
 * `editor` is barred from both entirely (can still create/edit everything else), and `writer`
 * is limited to content fields only, same shape as `USER_PERMISSION_MATRIX`.
 */
export const PAGE_PERMISSION_MATRIX: EntityPermissionMatrix<UserRole, PageAction, PageEditableField> = {
  'super-admin': { actions: ['create', 'update', 'delete'], editableFields: ALL_FIELDS },
  admin: { actions: ['create', 'update', 'delete'], editableFields: ALL_FIELDS },
  editor: { actions: ['create', 'update'], editableFields: EDITOR_FIELDS },
  writer: { actions: ['update'], editableFields: WRITER_FIELDS },
  user: { actions: [], editableFields: [] }
};

export const canPerformPageAction = (role: UserRole, action: PageAction): boolean =>
  canPerformAction(PAGE_PERMISSION_MATRIX, role, action);

export const getEditablePageFields = (role: UserRole): readonly PageEditableField[] =>
  getEditableFields(PAGE_PERMISSION_MATRIX, role);

/**
 * `writer`'s `metadata` access is limited to title/description (checked client-side, in the
 * form) — `layout` picks which component renders the page, so only roles with full field access
 * may touch it.
 */
export const canEditPageLayoutField = (role: UserRole): boolean =>
  role !== 'writer' && getEditablePageFields(role).includes('metadata');
