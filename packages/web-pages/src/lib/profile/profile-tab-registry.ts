import type { ComponentType } from 'react';
import { Settings, UserRound, type LucideIcon } from 'lucide-react';
import { ProfileTab } from './profile-tab.js';
import { SettingsTab } from './settings-tab.js';

export interface ProfileTabContext {
  readonly isOwner: boolean;
  readonly userId: string;
}

export interface ProfileTabDefinition {
  readonly id: string;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly component: ComponentType<{ readonly context: ProfileTabContext }>;
  readonly enabled?: (context: ProfileTabContext) => boolean;
}

export const PROFILE_TAB_REGISTRY: readonly ProfileTabDefinition[] = [
  { id: 'profile', label: 'Profile', icon: UserRound, component: ProfileTab, enabled: (context) => context.isOwner },
  { id: 'settings', label: 'Settings', icon: Settings, component: SettingsTab, enabled: (context) => context.isOwner },
];

export const resolveActiveProfileTabs = (
  registry: readonly ProfileTabDefinition[],
  context: ProfileTabContext
): readonly ProfileTabDefinition[] => registry.filter((tab) => (tab.enabled ? tab.enabled(context) : true));
