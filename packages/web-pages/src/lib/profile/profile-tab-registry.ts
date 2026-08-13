import { UserRound, Settings } from 'lucide-react';
import { ProfileTab } from './profile-tab.js';
import { SettingsTab } from './settings-tab.js';

/**
 * `ProfileTabDefinition`/`ProfileTabContext` are now canonically owned by `@inithium/plugin-engine`
 * — the exact contract shape plugins implement for the User Profile Tab Registry surface.
 * Re-exported here so existing imports from `@inithium/web-pages` keep working unchanged.
 */
export type { ProfileTabDefinition, ProfileTabContext } from '@inithium/plugin-engine/client';
import type { ProfileTabDefinition, ProfileTabContext } from '@inithium/plugin-engine/client';

export const PROFILE_TAB_REGISTRY: readonly ProfileTabDefinition[] = [
  { id: 'profile', label: 'Profile', icon: UserRound, component: ProfileTab, enabled: (context) => context.isOwner },
  { id: 'settings', label: 'Settings', icon: Settings, component: SettingsTab, enabled: (context) => context.isOwner },
];

export const resolveActiveProfileTabs = (
  registry: readonly ProfileTabDefinition[],
  context: ProfileTabContext
): readonly ProfileTabDefinition[] => registry.filter((tab) => (tab.enabled ? tab.enabled(context) : true));
