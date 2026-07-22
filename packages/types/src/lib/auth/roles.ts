export const USER_ROLES = ['super-admin', 'admin', 'editor', 'writer', 'user'] as const;

export type UserRole = (typeof USER_ROLES)[number];
