import type { AssetCategory, SettingValueType } from '@inithium/models';

export type { SettingValueType };
export { SETTING_VALUE_TYPES } from '@inithium/models';

export interface SettingArrayItem {
  readonly id: string;
  readonly type: SettingValueType;
  readonly value: SettingValueEditorValue;
  /** Which asset category this row's picker is restricted to. Only meaningful (and only ever set) when `type` is `'asset'`. */
  readonly assetCategory?: AssetCategory;
}

export interface SettingObjectEntry {
  readonly id: string;
  readonly key: string;
  readonly type: SettingValueType;
  readonly value: SettingValueEditorValue;
  /** Which asset category this row's picker is restricted to. Only meaningful (and only ever set) when `type` is `'asset'`. */
  readonly assetCategory?: AssetCategory;
}

/**
 * A node's in-progress edited value. `string`/`number`/`asset` are all kept as raw text (so a
 * number field can hold an incomplete value like `"-"` mid-edit without being force-parsed on
 * every keystroke, and an `asset` node just holds whatever URL the asset picker hands back) —
 * only `toJsonValue` coerces `number` nodes to an actual `number` at submit time. `array`/`object`
 * carry their children as id-tagged rows so `AutoIncrementList` can key each row by a stable id
 * instead of its position, which is what keeps sibling rows' focus/state intact when a row
 * elsewhere in the same list is added or removed.
 */
export type SettingValueEditorValue = string | boolean | readonly SettingArrayItem[] | readonly SettingObjectEntry[];

export interface SettingValueEditorProps {
  readonly type: SettingValueType;
  readonly value: SettingValueEditorValue;
  readonly onChange: (value: SettingValueEditorValue) => void;
  /**
   * Which asset category the picker is restricted to when `type` is `'asset'` (ignored for every
   * other type) — there's no way to derive this from the stored value alone (a bare asset URL
   * doesn't self-describe whether it's an image, a font, etc.), so it's threaded down from
   * wherever this node's own category choice lives: a sibling field on `SettingArrayItem`/
   * `SettingObjectEntry` for nested nodes, or the caller's own state for the root node.
   */
  readonly assetCategory?: AssetCategory;
  /** Required alongside `assetCategory` when `type` can be `'asset'` — reports the category the admin picked from the "Asset Type" selector. */
  readonly onAssetCategoryChange?: (category: AssetCategory) => void;
  /**
   * When `type` is `'asset'` and this is `true`, the "Asset Type" selector renders disabled
   * instead of interactive. Set once a node's category came from a persisted, already-committed
   * source (the root setting's own `settingSubType`) rather than a fresh, uncommitted choice —
   * the whole point of persisting the category is so it can't be casually reassigned by an
   * accidental click on a routine edit; changing it is still possible, just deliberately, by
   * switching the type away from `'asset'` and back. Ignored for nested nodes, which have no
   * persisted category of their own to lock.
   */
  readonly assetCategoryLocked?: boolean;
  /** Nesting depth, used only to decide whether to draw the indent guide on object/array children. Callers building the root editor should omit this (defaults to 0). */
  readonly depth?: number;
}
