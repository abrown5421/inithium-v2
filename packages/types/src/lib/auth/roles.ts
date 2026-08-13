export const USER_ROLES = ['super-admin', 'admin', 'editor', 'writer', 'user'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const CMS_ROLES: readonly UserRole[] = ['super-admin', 'admin', 'editor', 'writer'];

export const isCmsRole = (role: UserRole): boolean => CMS_ROLES.includes(role);
