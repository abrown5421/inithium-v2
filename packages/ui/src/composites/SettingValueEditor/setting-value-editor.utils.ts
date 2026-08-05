import type {
  SettingArrayItem,
  SettingObjectEntry,
  SettingValueEditorValue,
  SettingValueType
} from './setting-value-editor.types.js';
import type { AssetCategory } from '@inithium/models';

let nextNodeId = 0;

/** Monotonic, collision-free within a session — rows only ever need uniqueness among their own siblings, never globally. */
export const createSettingNodeId = (): string => `setting-node-${nextNodeId++}`;

/**
 * Seeds `array`/`object` with one blank row rather than an empty list — matching
 * `AutoIncrementList`'s own uncontrolled default (it always starts at one row, never zero), so
 * switching a field's type to `array`/`object` shows an immediately-editable row instead of a
 * bare "+" the user has to click once just to see the key/type/value inputs appear.
 */
export const createEmptySettingValue = (type: SettingValueType): SettingValueEditorValue => {
  switch (type) {
    case 'string':
    case 'number':
    case 'color':
    case 'asset':
      return '';
    case 'boolean':
      return false;
    case 'array':
      return [{ id: createSettingNodeId(), type: 'string', value: '' }];
    case 'object':
      return [{ id: createSettingNodeId(), key: '', type: 'string', value: '' }];
  }
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date);

/** Hex (`#fff`/`#ffffff`/with alpha), or a `rgb()`/`hsl()`/`oklch()`/`oklab()`/`lab()`/`lch()`/`color()` function — covers what `ColorPicker` and typical theme tokens (like the example `oklch(...)` setting) actually store. */
const CSS_COLOR_PATTERN = /^\s*(#[0-9a-fA-F]{3,8}|(rgb|rgba|hsl|hsla|oklch|oklab|lab|lch|color)\([^)]*\))\s*$/;

/**
 * Matches an asset proxy URL in either form: the bare relative path this codebase's existing
 * settings store (`/assets/by-key/<key>`), or a fully-qualified URL with an origin prefix (what
 * `AssetWithUrl.url` — and so the `AssetPicker` composite — actually produces). Deliberately loose
 * about the key's own shape (assets aren't required to key on a UUID).
 */
const ASSET_URL_PATTERN = /^(https?:\/\/[^/]+)?\/assets\/by-key\/[^/?#]+\/?$/;

interface InferredSettingValue {
  readonly type: SettingValueType;
  readonly value: SettingValueEditorValue;
  /** Only ever populated when `type` is `'asset'`, and even then only when it was resolvable — see `fromJsonValue`'s doc comment. */
  readonly assetCategory?: AssetCategory;
}

/**
 * Builds a fresh, id-tagged editor tree from an arbitrary JSON-ish value (a `Setting.settingValue`
 * being opened for editing). `Date` instances and anything not representable by the editable types
 * collapse to a `string` node — dates round-trip fine as ISO strings since the backend already
 * deserializes ISO date strings back into `Date` on write (see `@inithium/services`'
 * `deserializeSettingValue`), and there is no dedicated date type in the type `Select`.
 *
 * A string that already looks like a CSS color is inferred as `color`, and one that looks like an
 * asset proxy URL is inferred as `asset` — so reopening a setting like `site.theme` or `site.logo`
 * shows the richer control instead of a bare text input. Newly-typed strings still default to
 * plain `string` until the type `Select` is switched manually. `asset` nodes always come back with
 * `assetCategory: undefined`: which category a bare URL was picked from isn't recoverable from the
 * URL alone (nothing about `/assets/by-key/<key>` says "this one's an image"), so the admin has to
 * pick — or re-confirm — the category via the "Asset Type" selector every time an asset-typed
 * field is opened. That's intentional, not a gap to paper over with a guess: silently assuming a
 * category (e.g. from the setting's name) is exactly the kind of "looks right, is actually the
 * wrong category" mistake an explicit picker is meant to prevent.
 */
export const fromJsonValue = (value: unknown): InferredSettingValue => {
  if (value instanceof Date) return { type: 'string', value: value.toISOString() };
  if (typeof value === 'string') {
    if (ASSET_URL_PATTERN.test(value)) return { type: 'asset', value };
    return { type: CSS_COLOR_PATTERN.test(value) ? 'color' : 'string', value };
  }
  if (typeof value === 'number') return { type: 'number', value: String(value) };
  if (typeof value === 'boolean') return { type: 'boolean', value };

  if (Array.isArray(value)) {
    const items: SettingArrayItem[] = value.map((entry) => {
      const inferred = fromJsonValue(entry);
      return { id: createSettingNodeId(), type: inferred.type, value: inferred.value, assetCategory: inferred.assetCategory };
    });
    return { type: 'array', value: items };
  }

  if (isPlainObject(value)) {
    const entries: SettingObjectEntry[] = Object.entries(value).map(([key, entry]) => {
      const inferred = fromJsonValue(entry);
      return {
        id: createSettingNodeId(),
        key,
        type: inferred.type,
        value: inferred.value,
        assetCategory: inferred.assetCategory
      };
    });
    return { type: 'object', value: entries };
  }

  return { type: 'string', value: '' };
};

/**
 * Resolves the root editor node from a `Setting` record's own three raw fields. When
 * `settingType` is present (and, for the ambiguous string-backed shapes — `string`/`color`/
 * `asset` — actually matches `settingValue`'s runtime type), it's trusted outright: no guessing,
 * and `settingSubType` is used directly as the resolved `assetCategory`. That's the whole point of
 * persisting these fields — a setting that's already been saved as `asset`/`fonts` reopens as
 * `asset`/`fonts` every time, not "whatever the picker feels like guessing this time." Falls back
 * to `fromJsonValue`'s structural/pattern-based inference for settings saved before this schema
 * existed (no `settingType` at all), or if `settingType` and the actual value ever disagree.
 * Nested descendants of `array`/`object` values always go through `fromJsonValue` regardless —
 * only the root setting has a persisted type/sub-type slot.
 */
export const hydrateSettingValue = (
  settingType: SettingValueType | undefined,
  settingSubType: string | undefined,
  settingValue: unknown
): InferredSettingValue => {
  const isStringBackedType = settingType === 'string' || settingType === 'color' || settingType === 'asset';

  if (isStringBackedType && typeof settingValue === 'string') {
    return {
      type: settingType,
      value: settingValue,
      assetCategory: settingType === 'asset' ? (settingSubType as AssetCategory | undefined) : undefined
    };
  }

  return fromJsonValue(settingValue);
};

/**
 * Walks an editor tree looking for any `asset` node — at any depth — whose category hasn't been
 * chosen yet. Called with the root's own `(type, value, assetCategory)` triplet; nested nodes are
 * checked against their own `assetCategory` field. Meant to gate submission: an unrestricted asset
 * picker is exactly the "picked a font where a logo was expected" mistake this type exists to
 * prevent, so saving is blocked until every `asset` field has an explicit category.
 */
export const hasUnresolvedAssetCategory = (
  type: SettingValueType,
  value: SettingValueEditorValue,
  assetCategory?: AssetCategory
): boolean => {
  if (type === 'asset') return assetCategory === undefined;
  if (type === 'array') {
    return (value as readonly SettingArrayItem[]).some((item) =>
      hasUnresolvedAssetCategory(item.type, item.value, item.assetCategory)
    );
  }
  if (type === 'object') {
    return (value as readonly SettingObjectEntry[]).some((entry) =>
      hasUnresolvedAssetCategory(entry.type, entry.value, entry.assetCategory)
    );
  }
  return false;
};

/**
 * Normalizes an editor tree into the plain JSON-compatible payload the API expects. Object
 * entries with a blank key are dropped rather than sent as `""` — the key input is required in
 * the UI, but a row can transiently exist with an empty key mid-edit. `asset` nodes serialize to
 * their bare URL string, same as `string`/`color` — the category constraint that shaped which
 * asset could be picked is an editor-only concern and was never meant to be persisted.
 */
export const toJsonValue = (type: SettingValueType, value: SettingValueEditorValue): unknown => {
  switch (type) {
    case 'string':
    case 'color':
    case 'asset':
      return value as string;
    case 'number': {
      const parsed = Number(value as string);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    case 'boolean':
      return value as boolean;
    case 'array':
      return (value as readonly SettingArrayItem[]).map((item) => toJsonValue(item.type, item.value));
    case 'object':
      return (value as readonly SettingObjectEntry[]).reduce<Record<string, unknown>>((acc, entry) => {
        if (!entry.key) return acc;
        return { ...acc, [entry.key]: toJsonValue(entry.type, entry.value) };
      }, {});
  }
};
