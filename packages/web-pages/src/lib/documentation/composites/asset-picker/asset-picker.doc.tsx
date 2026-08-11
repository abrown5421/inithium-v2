import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  PaginationControl,
  SearchFilterBar,
  type SearchFieldConfig,
} from '@inithium/ui';
import { Image as ImageIcon } from 'lucide-react';
import { CompositeDocView } from '../components/composite-doc-view.js';
import type { CompositeDoc } from '../composite-doc.types.js';

interface MockAsset {
  readonly id: string;
  readonly name: string;
}

const MOCK_ASSETS: readonly MockAsset[] = [
  { id: '1', name: 'primary-logo.png' },
  { id: '2', name: 'hero-banner.webp' },
  { id: '3', name: 'team-photo.webp' },
  { id: '4', name: 'og-image.png' },
];

const MOCK_SEARCH_FIELDS: readonly SearchFieldConfig[] = [
  { value: 'originalName', label: 'Name', type: 'string' },
];

const AssetPickerDemo = () => {
  const [value, setValue] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const filtered = MOCK_ASSETS.filter((asset) => asset.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-full max-w-sm">
      <Input
        value={value}
        placeholder="Select an image…"
        onClick={() => setOpen(true)}
        onChange={() => undefined}
        readOnly
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Select an asset</DialogTitle>
            <DialogDescription>Preview uses mock data — the live component fetches from the Asset API.</DialogDescription>
          </DialogHeader>
          <SearchFilterBar
            fields={MOCK_SEARCH_FIELDS}
            field="originalName"
            value={search}
            onFieldChange={() => undefined}
            onValueChange={setSearch}
          />
          <ul className="grid grid-cols-4 gap-3">
            {filtered.map((asset) => (
              <li key={asset.id}>
                <button
                  type="button"
                  onClick={() => {
                    setValue(asset.name);
                    setOpen(false);
                  }}
                  className="flex w-full flex-col items-center gap-1.5 rounded-md p-2 text-center hover:bg-muted"
                >
                  <div className="flex size-16 items-center justify-center rounded-md border border-border bg-muted">
                    <ImageIcon className="size-6 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <span className="w-full truncate text-xs text-foreground">{asset.name}</span>
                </button>
              </li>
            ))}
          </ul>
          <PaginationControl currentPage={1} totalPages={1} onPageChange={() => undefined} className="justify-self-center" />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ASSET_PICKER_DOC: CompositeDoc = {
  overview: (
    <>
      AssetPicker is a text-input trigger that opens a searchable, paginated modal library of uploaded
      assets, and writes back the selected asset's domain-independent proxy path (
      <code>/assets/by-key/&lt;key&gt;</code>) rather than a fully-qualified URL — matching exactly how{' '}
      <code>site.logo</code> and every other asset-backed Setting persist their value. Enterprise use
      cases include picking a logo or hero image in a settings form, and the asset-typed branch of
      SettingValueEditor.
    </>
  ),
  importStatement: "import { AssetPicker } from '@inithium/ui';",
  composition: [
    { name: 'Input', role: 'The visible trigger field — clicking or (optionally) focusing it opens the picker dialog.' },
    { name: 'Dialog', role: 'Hosts the browsing UI, opened/closed via internal state.' },
    { name: 'SearchFilterBar', role: 'Filters the library by name, system/user origin, and asset category — the category field hides itself once assetCategory locks the picker to one type.' },
    { name: 'PaginationControl', role: 'Pages through results.' },
    { name: 'useAssetPicker', role: 'Internal hook pairing useReadAllAssetsQuery with the same useEntityListState pagination/search state the CMS asset management page uses.' },
  ],
  propGroups: [
    {
      component: 'AssetPicker',
      props: [
        { name: 'value', type: 'string', description: 'Controlled selected asset proxy path.' },
        { name: 'onValueChange', type: '(value: string) => void', description: 'Called with the selected asset\'s /assets/by-key/<key> path.' },
        { name: 'user', type: 'string', description: "Scopes the library to one user's uploads by GUID. Omit to browse system assets plus every user's uploads." },
        { name: 'pageLimit', type: 'number', defaultValue: '10', description: 'Assets fetched per page.' },
        { name: 'assetCategory', type: 'AssetCategory', description: "Locks the picker to one category (e.g. 'images'), hiding the Type filter." },
        { name: 'dialogTitle', type: 'React.ReactNode', description: 'Dialog header title.' },
        { name: 'dialogDescription', type: 'React.ReactNode', description: 'Dialog header description.' },
        { name: 'emptyMessage', type: 'React.ReactNode', defaultValue: "'No assets found'", description: 'Shown in place of the grid when the current page has no results.' },
        { name: 'triggerOnFocus', type: 'boolean', defaultValue: 'false', description: 'Opens the dialog on keyboard focus, not just click.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Image picker (mocked)',
      description: 'This preview recreates AssetPicker\'s UI from the same SearchFilterBar/PaginationControl primitives, wired to a local mock array instead of the real Asset API, so the documentation page never depends on live backend state.',
      code: `<AssetPicker
  value={logoPath}
  onValueChange={setLogoPath}
  assetCategory="images"
  placeholder="Select a logo…"
/>`,
      preview: <AssetPickerDemo />,
    },
  ],
};

export const AssetPickerDoc = () => <CompositeDocView doc={ASSET_PICKER_DOC} />;
