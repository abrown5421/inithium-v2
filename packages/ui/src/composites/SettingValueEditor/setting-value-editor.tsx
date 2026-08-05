import * as React from 'react';
import type { AssetCategory } from '@inithium/models';
import { ASSET_CATEGORIES } from '@inithium/models';
import { Input } from '../../primitives/input.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../primitives/select.js';
import { Switch } from '../../primitives/switch.js';
import { Text } from '../../primitives/text.js';
import { AutoIncrementList } from '../AutoIncrementList/auto-increment-list.js';
import { AssetPicker } from '../AssetPicker/asset-picker.js';
import { ASSET_CATEGORY_LABELS } from '../AssetPicker/use-asset-picker.js';
import { ColorPicker } from '../ColorPicker/color-picker.js';
import { createEmptySettingValue, createSettingNodeId } from './setting-value-editor.utils.js';
import type {
  SettingArrayItem,
  SettingObjectEntry,
  SettingValueEditorProps,
  SettingValueType
} from './setting-value-editor.types.js';

const TYPE_LABELS: Record<SettingValueType, string> = {
  string: 'String',
  number: 'Number',
  boolean: 'Boolean',
  color: 'Color',
  asset: 'Asset',
  array: 'Array',
  object: 'Object'
};

const TypeSelect: React.FC<{ value: SettingValueType; onChange: (type: SettingValueType) => void }> = ({
  value,
  onChange
}) => (
  <Select value={value} onValueChange={(next) => onChange(next as SettingValueType)}>
    <SelectTrigger className="w-32 shrink-0">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {(Object.keys(TYPE_LABELS) as SettingValueType[]).map((type) => (
        <SelectItem key={type} value={type}>
          {TYPE_LABELS[type]}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

const AssetCategorySelect: React.FC<{
  value: AssetCategory | undefined;
  onChange: (category: AssetCategory) => void;
  disabled?: boolean;
}> = ({ value, onChange, disabled }) => (
  <Select value={value ?? ''} onValueChange={(next) => onChange(next as AssetCategory)} disabled={disabled}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Select asset type…" />
    </SelectTrigger>
    <SelectContent>
      {ASSET_CATEGORIES.map((category) => (
        <SelectItem key={category} value={category}>
          {ASSET_CATEGORY_LABELS[category]}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

/**
 * Recursive editor for a `Setting.settingValue` of any of the seven supported shapes. `object`/
 * `array` render their children through `AutoIncrementList` in controlled mode, one row per
 * child, each row carrying its own stable id (assigned once, at row-creation time) so adding or
 * removing a sibling never remounts — and so never steals focus from — the rows around it.
 * Nested `object`/`array` children recurse into another instance of this same component, indented
 * with `border-l-2 pl-4` to make the nesting visible.
 */
export const SettingValueEditor: React.FC<SettingValueEditorProps> = ({
  type,
  value,
  onChange,
  assetCategory,
  onAssetCategoryChange,
  assetCategoryLocked = false,
  depth = 0
}) => {
  if (type === 'string') {
    return <Input value={value as string} onChange={(event) => onChange(event.target.value)} />;
  }

  if (type === 'number') {
    return <Input type="number" value={value as string} onChange={(event) => onChange(event.target.value)} />;
  }

  if (type === 'boolean') {
    return <Switch checked={value as boolean} onCheckedChange={(checked) => onChange(checked)} />;
  }

  if (type === 'color') {
    return <ColorPicker value={value as string} onValueChange={onChange} className="w-full" />;
  }

  if (type === 'asset') {
    return (
      <div className="flex flex-col gap-1.5">
        <AssetCategorySelect
          value={assetCategory}
          onChange={(category) => onAssetCategoryChange?.(category)}
          disabled={assetCategoryLocked}
        />
        {assetCategoryLocked ? (
          <Text as="span" size="xs" tone="muted">
            Asset type is locked — switch Setting Type away from Asset and back to change it.
          </Text>
        ) : null}
        <AssetPicker
          value={value as string}
          onValueChange={onChange}
          assetCategory={assetCategory}
          placeholder="Select an asset…"
        />
      </div>
    );
  }

  const isContainer = (childType: SettingValueType): boolean => childType === 'object' || childType === 'array';

  if (type === 'array') {
    const items = value as readonly SettingArrayItem[];

    return (
      <AutoIncrementList<SettingArrayItem>
        values={items}
        getRowKey={(item) => item.id}
        getRowContentClassName={(item) => (isContainer(item.type) ? 'min-w-0' : 'min-w-0 flex-1')}
        createItem={() => ({ id: createSettingNodeId(), type: 'string', value: '' })}
        onValuesChange={(next) => onChange(next)}
        renderItem={({ value: item, onChange: onItemChange }) => (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <TypeSelect
                value={item.type}
                onChange={(nextType) => onItemChange({ ...item, type: nextType, value: createEmptySettingValue(nextType), assetCategory: undefined })}
              />
              {isContainer(item.type) ? null : (
                <div className="min-w-0 flex-1">
                  <SettingValueEditor
                    type={item.type}
                    value={item.value}
                    onChange={(nextValue) => onItemChange({ ...item, value: nextValue })}
                    assetCategory={item.assetCategory}
                    onAssetCategoryChange={(category) => onItemChange({ ...item, assetCategory: category })}
                    depth={depth + 1}
                  />
                </div>
              )}
            </div>
            {isContainer(item.type) ? (
              <div className="border-l-2 border-border pl-4">
                <SettingValueEditor
                  type={item.type}
                  value={item.value}
                  onChange={(nextValue) => onItemChange({ ...item, value: nextValue })}
                  depth={depth + 1}
                />
              </div>
            ) : null}
          </div>
        )}
      />
    );
  }

  const entries = value as readonly SettingObjectEntry[];

  return (
    <AutoIncrementList<SettingObjectEntry>
      values={entries}
      getRowKey={(entry) => entry.id}
      getRowContentClassName={(entry) => (isContainer(entry.type) ? 'min-w-0' : 'min-w-0 flex-1')}
      createItem={() => ({ id: createSettingNodeId(), key: '', type: 'string', value: '' })}
      onValuesChange={(next) => onChange(next)}
      renderItem={({ value: entry, onChange: onEntryChange }) => (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Key"
              value={entry.key}
              onChange={(event) => onEntryChange({ ...entry, key: event.target.value })}
              className="w-40 shrink-0"
            />
            <TypeSelect
              value={entry.type}
              onChange={(nextType) => onEntryChange({ ...entry, type: nextType, value: createEmptySettingValue(nextType), assetCategory: undefined })}
            />
            {isContainer(entry.type) ? null : (
              <div className="min-w-0 flex-1">
                <SettingValueEditor
                  type={entry.type}
                  value={entry.value}
                  onChange={(nextValue) => onEntryChange({ ...entry, value: nextValue })}
                  assetCategory={entry.assetCategory}
                  onAssetCategoryChange={(category) => onEntryChange({ ...entry, assetCategory: category })}
                  depth={depth + 1}
                />
              </div>
            )}
          </div>
          {isContainer(entry.type) ? (
            <div className="border-l-2 border-border pl-4">
              <SettingValueEditor
                type={entry.type}
                value={entry.value}
                onChange={(nextValue) => onEntryChange({ ...entry, value: nextValue })}
                depth={depth + 1}
              />
            </div>
          ) : null}
        </div>
      )}
    />
  );
};

SettingValueEditor.displayName = 'SettingValueEditor';
