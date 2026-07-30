import { z } from 'zod';
import { ANIMATE_ENTRIES, ANIMATE_EXITS, NAV_LOCATIONS, THEME_TOKENS, USER_ROLES } from '@inithium/types';

export const pageThemeSchema = z.object({
  backgroundColor: z.enum(THEME_TOKENS),
  foregroundColor: z.enum(THEME_TOKENS)
});

export const pageAnimationsSchema = z.object({
  entrance: z.enum(ANIMATE_ENTRIES),
  exit: z.enum(ANIMATE_EXITS)
});

export const pageAccessControlSchema = z.object({
  authenticated: z.boolean(),
  anonymousOnly: z.boolean(),
  roles: z.array(z.enum(USER_ROLES))
});

export const pageFlagsSchema = z.object({
  isActive: z.boolean(),
  isSystem: z.boolean()
});

export const pageMetadataSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  layout: z.string().min(1)
});

export const pageNavigationSchema = z.object({
  label: z.string().min(1),
  location: z.enum(NAV_LOCATIONS),
  order: z.number().optional(),
  isButton: z.boolean().optional(),
  resolveNavPath: z.string().nullable().optional()
});

export const createPageSchema = z.object({
  id: z.string().min(1),
  pageName: z.string().min(1),
  route: z.string().min(1).startsWith('/'),
  app: z.string().min(1),
  theme: pageThemeSchema,
  animations: pageAnimationsSchema,
  accessControl: pageAccessControlSchema,
  flags: pageFlagsSchema,
  metadata: pageMetadataSchema,
  navigation: z.array(pageNavigationSchema).optional()
});

export const updatePageSchema = createPageSchema.partial();

export type CreatePageDTO = z.infer<typeof createPageSchema>;
export type UpdatePageDTO = z.infer<typeof updatePageSchema>;
