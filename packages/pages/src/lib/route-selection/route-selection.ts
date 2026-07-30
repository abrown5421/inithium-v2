import { Page } from '@inithium/models';

export const selectActivePagesForApp = (pages: readonly Page[], app: string): readonly Page[] =>
  pages.filter((page) => page.app === app && page.flags.isActive);
