import * as React from 'react';
import { SettingValueEditor, createSettingNodeId, type SettingObjectEntry, type SettingValueEditorValue } from '@inithium/ui';
import { CompositeDocView } from '../components/composite-doc-view.js';
import type { CompositeDoc } from '../composite-doc.types.js';

const SettingValueEditorDemo = () => {
  const [entries, setEntries] = React.useState<readonly SettingObjectEntry[]>([
    { id: createSettingNodeId(), key: 'displayName', type: 'string', value: 'Acme Corp' },
    { id: createSettingNodeId(), key: 'notificationsEnabled', type: 'boolean', value: true },
    { id: createSettingNodeId(), key: 'accentColor', type: 'color', value: 'var(--primary)' },
  ]);

  const handleChange = (next: SettingValueEditorValue) => setEntries(next as readonly SettingObjectEntry[]);

  return (
    <div className="w-full max-w-md">
      <SettingValueEditor type="object" value={entries} onChange={handleChange} />
    </div>
  );
};

const SETTING_VALUE_EDITOR_DOC: CompositeDoc = {
  overview: (
    <>
      SettingValueEditor recursively renders an editor for a CMS Setting's value, across all 7 supported
      shapes — string, number, boolean, color, asset, array, and object. Array/object children render
      through AutoIncrementList in controlled mode, one row per child, each carrying a stable id assigned
      once at creation time so adding or removing a sibling never remounts (or steals focus from) the
      rows around it. Nested array/object children recurse into another instance of this same component,
      indented to make the nesting visible. Enterprise use case: the value editor inside the Settings
      Module for every Setting — site.theme, site.logo, and any custom setting an admin defines.
    </>
  ),
  importStatement: "import { SettingValueEditor } from '@inithium/ui';",
  composition: [
    { name: 'Input', role: "Leaf editor for 'string' and 'number' (kept as raw text until submit, so an in-progress value like '-' never gets force-parsed)." },
    { name: 'Switch', role: "Leaf editor for 'boolean'." },
    { name: 'ColorPicker', role: "Leaf editor for 'color'." },
    { name: 'AssetPicker', role: "Leaf editor for 'asset', scoped to whichever category the Asset Type selector currently holds — see the AssetPicker doc page for a mocked preview of this control." },
    { name: 'AutoIncrementList', role: "Renders 'array'/'object' children as controlled rows, each carrying a type selector and a nested SettingValueEditor." },
    { name: 'SettingValueEditor (recursive)', role: 'Each array/object child\'s own value renders through another instance of this same component, one depth deeper.' },
  ],
  propGroups: [
    {
      component: 'SettingValueEditor',
      props: [
        { name: 'type', type: "'string' | 'number' | 'boolean' | 'color' | 'asset' | 'array' | 'object'", required: true, description: 'Which editor renders for value.' },
        { name: 'value', type: 'SettingValueEditorValue', required: true, description: 'The current in-progress value, shaped to match type.' },
        { name: 'onChange', type: '(value: SettingValueEditorValue) => void', required: true, description: 'Called with the full next value on every edit.' },
        { name: 'assetCategory', type: 'AssetCategory', description: "Which category the picker is restricted to when type is 'asset'. Ignored otherwise." },
        { name: 'onAssetCategoryChange', type: '(category: AssetCategory) => void', description: 'Reports the category chosen from the Asset Type selector.' },
        { name: 'assetCategoryLocked', type: 'boolean', defaultValue: 'false', description: "Disables the Asset Type selector once a node's category came from a persisted, already-committed source." },
        { name: 'depth', type: 'number', defaultValue: '0', description: 'Nesting depth, used only to decide whether to draw the indent guide on array/object children.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Object value — string, boolean, and color entries',
      description: 'The asset-typed branch isn\'t mounted live here (it depends on the real Asset API) — see the AssetPicker doc page for its mocked preview.',
      code: `const [entries, setEntries] = useState<readonly SettingObjectEntry[]>([
  { id: createSettingNodeId(), key: 'displayName', type: 'string', value: 'Acme Corp' },
  { id: createSettingNodeId(), key: 'notificationsEnabled', type: 'boolean', value: true },
  { id: createSettingNodeId(), key: 'accentColor', type: 'color', value: 'var(--primary)' }
]);

<SettingValueEditor type="object" value={entries} onChange={setEntries} />`,
      preview: <SettingValueEditorDemo />,
    },
  ],
};

export const SettingValueEditorDoc = () => <CompositeDocView doc={SETTING_VALUE_EDITOR_DOC} />;
