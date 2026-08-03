/**
 * Flat string form state for the create/edit modal. `Page`'s create/update DTOs are deeply
 * nested (`theme`, `animations`, `accessControl`, `flags`, `metadata`, a single `navigation`
 * entry) — `EntityFormDialog` only understands flat `Record<string, string>` values, so nested
 * fields are flattened here as `group_field` keys (e.g. `theme_backgroundColor`) and reassembled
 * into the nested DTO shape at submit time. `navigation` supports a single entry, matching every
 * page created so far; `navigation_enabled` toggles whether that entry is included at all.
 */
export interface PageFormValues {
  readonly [key: string]: string;
  readonly id: string;
  readonly pageName: string;
  readonly route: string;
  readonly app: string;
  readonly theme_backgroundColor: string;
  readonly theme_foregroundColor: string;
  readonly animations_entrance: string;
  readonly animations_exit: string;
  readonly accessControl_authenticated: string;
  readonly accessControl_anonymousOnly: string;
  readonly accessControl_roles: string;
  readonly flags_isActive: string;
  readonly flags_isSystem: string;
  readonly metadata_title: string;
  readonly metadata_description: string;
  readonly metadata_layout: string;
  readonly navigation_enabled: string;
  readonly navigation_label: string;
  readonly navigation_location: string;
  readonly navigation_order: string;
  readonly navigation_isButton: string;
}
