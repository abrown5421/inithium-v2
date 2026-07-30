export const NAV_LOCATIONS = ['main', 'profile', 'footer', 'cms'] as const;

export type NavLocation = (typeof NAV_LOCATIONS)[number];
