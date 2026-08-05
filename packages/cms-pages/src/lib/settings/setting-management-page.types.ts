/**
 * Flat string form state for `settingName` and `settingType`, matching every other CMS module's
 * `EntityFormDialog` convention. `settingValue` deliberately has no key here: unlike `Page`'s
 * `navigation` (a fixed, bounded shape that flattens to `group_field` keys), `settingValue` is an
 * arbitrarily deep, dynamically-shaped tree chosen by the admin at runtime — it can't be flattened
 * to a static set of string keys, so it's tracked as its own `SettingValueEditorValue` tree in
 * component state instead (see `setting-management-page.tsx`), the same way Assets keeps its
 * `File` selection outside `formState.values`.
 */
export interface SettingFormValues {
  readonly [key: string]: string;
  readonly settingName: string;
  readonly settingType: string;
}
