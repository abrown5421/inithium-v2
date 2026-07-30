import { AnimateEntry, AnimateExit, BaseEntity, NavLocation, ThemeToken, UserRole } from '@inithium/types';

export interface PageTheme {
  readonly backgroundColor: ThemeToken;
  readonly foregroundColor: ThemeToken;
}

export interface PageAnimations {
  readonly entrance: AnimateEntry;
  readonly exit: AnimateExit;
}

export interface PageAccessControl {
  readonly authenticated: boolean;
  readonly anonymousOnly: boolean;
  readonly roles: readonly UserRole[];
}

export interface PageFlags {
  readonly isActive: boolean;
  readonly isSystem: boolean;
}

export interface PageMetadata {
  readonly title: string;
  readonly description: string;
  readonly layout: string;
}

export interface PageNavigation {
  readonly label: string;
  readonly location: NavLocation;
  readonly order?: number;
  readonly isButton?: boolean;
  readonly resolveNavPath?: string | null;
}

export interface Page extends BaseEntity {
  readonly id: string;
  readonly pageName: string;
  readonly route: string;
  readonly app: string;
  readonly theme: PageTheme;
  readonly animations: PageAnimations;
  readonly accessControl: PageAccessControl;
  readonly flags: PageFlags;
  readonly metadata: PageMetadata;
  readonly navigation?: readonly PageNavigation[];
}
