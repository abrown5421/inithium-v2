import type { SearchFieldConfig } from '@inithium/ui';
import type { SearchableUserField } from '../friendship.model.js';

export const FRIEND_SEARCH_FIELDS: readonly SearchFieldConfig[] = [
  { value: 'firstName', label: 'First Name', type: 'string' },
  { value: 'lastName', label: 'Last Name', type: 'string' },
  { value: 'email', label: 'Email', type: 'string' }
];

export const DEFAULT_FRIEND_SEARCH_FIELD: SearchableUserField = 'firstName';
